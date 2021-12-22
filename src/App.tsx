import React from 'react';
import './styles/App.css';
import {HelmetProvider} from 'react-helmet-async';
import {Carousel, Card} from "./lib";

const App: React.FC = () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <HelmetProvider>
            <div className="content-container">
                <div className="carousel-external-container">
                    <Carousel items={items} renderCard={(item, props) => <Card item={item} {...props}/>}/>
                </div>
            </div>
        </HelmetProvider>
    );
}

export default App
