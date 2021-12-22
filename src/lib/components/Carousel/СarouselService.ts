import {SetStateAction, Dispatch} from "react";
import {ICardItem} from "./Carousel";

class CarouselService {
    private ON_MOVE_OFFSET = 15

    private start_position = -1;

    getInitialItems = (items: Array<ICardItem>) => {
        return [
            ...items.slice(items.length / 2, items.length),
            ...items,
            ...items.slice(0, items.length / 2)
        ];
    }

    isExceedsRightBorder = (scrollX: number, position: number, items: any[], slidesToShow: number, dx: number = 0) => {
        if (dx) dx += this.ON_MOVE_OFFSET;
        return Math.abs(position + dx) / scrollX >= items.length - slidesToShow;
    }

    isExceedsLeftBorder = (position: number, dx: number = 0, offset: number = 0) => {
        return position + dx > offset;
    }

    isMoveExceedsBorders = (position: number, dx: number, scrollX: number, items: any[], slidesToShow: number) => {
        return this.isExceedsLeftBorder(position, dx, this.ON_MOVE_OFFSET) ||
            this.isExceedsRightBorder(scrollX, position, items, slidesToShow, dx);
    }

    checkTrackTransitionProperty = (trackElement: HTMLDivElement | null) => {
        if (trackElement && trackElement.style.transition.includes('none'))
            trackElement.style.transition = '400ms';
    }

    initializeSliderPosition = (trackElement: HTMLDivElement | null,
                                scrollX: number,
                                setPosition: Dispatch<SetStateAction<number>>,
                                items: any[]) => {
        if (trackElement) {
            trackElement.style.transition = 'none';
            setPosition(-scrollX * Math.round(items.length / 2));
        }
    }

    getConfig = (position: number, itemWidth: number, itemMargin: number) => {
        return {
            trackStyle: {
                transform: `translateX(${position}px)`,
            },
            itemStyle: {
                minWidth: `${itemWidth}px`,
                margin: `0 ${itemMargin}px`
            }
        }
    }

    setStartPosition(position: number){
        this.start_position = position;
    }

    calculateCardsOffsetCount(scrollX: number, endPosition: number){
        console.log(this.start_position, endPosition, scrollX);
        return Math.round(Math.abs(this.start_position - endPosition) / scrollX);
    }

}

export const service = new CarouselService();