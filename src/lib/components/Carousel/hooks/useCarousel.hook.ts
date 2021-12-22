import React, {useEffect, useLayoutEffect, useMemo, useState} from "react";
import {IBreakPoint, ICardItem} from '../Carousel';
import {service} from '../СarouselService';

enum Direction {
    left,
    right
}

type ICarouselHookProps = {
    items: Array<ICardItem>,
    itemsToScroll?: number,
    breakpoints: Array<IBreakPoint>,
    itemMargin: number,
    wrapper: React.RefObject<HTMLDivElement>,
    track: React.RefObject<HTMLDivElement>
}
type ICarouselHookReturn = {
    ready: boolean,
    config: { trackStyle: { transform: string }, itemStyle: { minWidth: string, margin: string } },
    prevBtnHandler: (e: React.MouseEvent) => void,
    nextBtnHandler: (e: React.MouseEvent) => void,
    onTouchStartHandler: (e: React.TouchEvent) => void,
    onTouchMoveHandler: (e: React.TouchEvent) => void,
    onTouchEndHandler: (e: React.TouchEvent) => void,
    onTransitionEndHandler: (e: React.TransitionEvent) => void,
    carouselItems: Array<ICardItem>
}
type ICarouselHook = (props: ICarouselHookProps) => ICarouselHookReturn;

export const useCarousel: ICarouselHook = props => {

    const {items, breakpoints, wrapper, track, itemMargin, itemsToScroll = 1} = props;

    const [carouselItems, setCarouselItems] = useState(service.getInitialItems(items));

    const [ready, setReady] = useState(false);
    const [position, setPosition] = useState(0);
    const [direction, setDirection] = useState<Direction | null>(null);
    const [wrapperWidth, setWrapperWidth] = useState(-1);
    const [touchStart, setTouchStart] = useState(0);

    useEffect(() => {
        const handler = () => {
            setWrapperWidth(wrapper.current!.clientWidth);
        }
        const observer = new ResizeObserver(handler);
        observer.observe(wrapper.current as Element);
        return () => {
            observer.disconnect();
        }
    }, [])
    useEffect(() => service.initializeSliderPosition(track.current, scrollX, setPosition, carouselItems), [wrapperWidth])
    useEffect(() => service.checkTrackTransitionProperty(track.current), [position, ready])

    useEffect(() => {

    }, [])

    const slidesToShow = useMemo(() => {
        for (const {slidesToShow, point} of breakpoints) {
            if (wrapperWidth < point && items.length > slidesToShow) return slidesToShow;
        }
        return items.length > 6 ? 6 : items.length;
    }, [wrapperWidth])
    const itemWidth = useMemo(() => {
        return (wrapperWidth - (slidesToShow * 2 - 2) * itemMargin) / slidesToShow;
    }, [wrapperWidth, slidesToShow])
    const scrollX = itemWidth + 2 * itemMargin

    const config = service.getConfig(position, itemWidth, itemMargin);

    //handlers
    const prevBtnHandler = (e: React.MouseEvent) => {
        if (service.isExceedsLeftBorder(position)) return;
        setDirection(Direction.left);
        setPosition(prevPos => prevPos + itemsToScroll * scrollX);
    }
    const nextBtnHandler = (e: React.MouseEvent) => {
        if (service.isExceedsRightBorder(scrollX, position, carouselItems, slidesToShow)) return;
        setDirection(Direction.right);
        setPosition(prevPos => prevPos - itemsToScroll * scrollX);
    }
    const onTouchStartHandler = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
        service.setStartPosition(position);
    }
    const onTouchMoveHandler = (e: React.TouchEvent) => {
        const dx = e.touches[0].clientX - touchStart;
        if (service.isMoveExceedsBorders(position, dx, scrollX, carouselItems, slidesToShow)) return;

        const direction = dx < 0 ? Direction.right : Direction.left;
        setTouchStart(e.touches[0].clientX);
        setDirection(direction);
        setPosition(prevPos => prevPos + dx);
    }

    //TODO refactoring
    const onTouchEndHandler = (e: React.TouchEvent) => {
        const dx = position % scrollX;
        console.log(service.calculateCardsOffsetCount(scrollX, position));
        switch (direction) {
            case Direction.left:
                setPosition(prevState => prevState - dx);
                break
            case Direction.right:
                if (Math.abs(dx) < itemWidth / 2) {
                    setPosition(prevState => prevState - dx);
                } else {
                    setPosition(prevState => prevState + (Math.abs(dx) - scrollX));
                }
        }
        setTouchStart(0);

    }
    //TODO refactoring
    const onTransitionEndHandler = (e: React.TransitionEvent) => {
        (e.target as HTMLDivElement).style.transition = 'none';
        if (direction === Direction.right) {
            const first = carouselItems.shift() as ICardItem;
            setPosition(prevPos => prevPos + itemsToScroll * scrollX);
            setCarouselItems([...carouselItems, first]);
        } else if (direction === Direction.left) {
            const last = carouselItems.pop() as ICardItem;
            setPosition(prevPos => prevPos - itemsToScroll * scrollX);
            setCarouselItems([last, ...carouselItems]);
        } else if (!ready) {
            setReady(true);
        }
    }

    return {
        ready,
        config,
        prevBtnHandler,
        nextBtnHandler,
        onTouchStartHandler,
        onTouchMoveHandler,
        onTouchEndHandler,
        onTransitionEndHandler,
        carouselItems
    }
}