import React from 'react';
import {ICardItem} from '../Carousel/Carousel';
import css from './Card.module.css';

interface ICardParams<U> {
    item: U
}

export const Card: React.FC<ICardParams<ICardItem>> = (props) => {
    const {item, ...nested} = props;
    return (
        <div className={css.slider_card} {...nested}>
            {item}
        </div>
    )
}