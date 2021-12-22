import React, { useRef } from 'react';
import css from 'classnames';
import styles from './Carousel.module.css';
import {Icon} from '../Icon/Icon';
import IconsSVG from '../Icon/icons.svg';
import {useCarousel} from "./hooks/useCarousel.hook";

const DEFAULT_BREAKPOINTS: Array<IBreakPoint> = [
    {point: 360, slidesToShow: 1},
    {point: 576, slidesToShow: 2},
    {point: 800, slidesToShow: 3},
    {point: 1300, slidesToShow: 4},
    {point: 1500, slidesToShow: 5},
];

export type IBreakPoint = {
    point: number,
    slidesToShow: number
}
export type ICardItem = Record<string, unknown> | string | number;

interface ICarouselParams<U> {
    breakpoints?: Array<IBreakPoint>,
    itemMargin?: number,
    items: Array<U>,
    renderCard: (item: U, props?: Record<string, unknown>) => JSX.Element
}

export const Carousel: React.FC<ICarouselParams<ICardItem>> = props => {
    const {breakpoints = DEFAULT_BREAKPOINTS, itemMargin = 10, items, renderCard} = props;

    const wrapper = useRef<HTMLDivElement>(null)
    const track = useRef<HTMLDivElement>(null)

    const {
        ready,
        config,
        prevBtnHandler,
        nextBtnHandler,
        onTouchStartHandler,
        onTouchMoveHandler,
        onTouchEndHandler,
        onTransitionEndHandler,
        carouselItems
    } = useCarousel({items, breakpoints, itemMargin, wrapper, track});

    return (
        <div className={styles.carousel_wrapper} ref={wrapper}>
            <div className={css(styles.carousel_button, styles.carousel_button__prev)}
                 onClick={prevBtnHandler}>
                <Icon name="carousel-arrow" file={IconsSVG}/>
            </div>
            <div className={styles.carousel_container}>
                <div className={styles.carousel_track}
                     onTransitionEnd={onTransitionEndHandler}
                     style={config.trackStyle}
                     ref={track}
                     onTouchStart={onTouchStartHandler}
                     onTouchMove={onTouchMoveHandler}
                     onTouchEnd={onTouchEndHandler}>
                    {carouselItems && ready && carouselItems.map((item, idx) => {
                        return renderCard(item, {key: idx, style: config.itemStyle});
                    })}
                </div>
            </div>
            <div className={css(styles.carousel_button, styles.carousel_button__next)}
                 onClick={nextBtnHandler}>
                <Icon name="carousel-arrow" file={IconsSVG}/>
            </div>
        </div>
    )
}
