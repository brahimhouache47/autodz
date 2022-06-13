import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import '../Slider.css';

function Slider() {
  const data = [
    {
      id: 1,
      image: 'images/p10.jpg',
      title: 'Title de Slide 1',
      text: 'Lorem10',
    },
    {
      id: 2,
      image: 'images/p.jpg',
      title: 'Title de Slide 2',
      text: 'Lorem10',
    },
    {
      id: 3,
      image: 'images/p1.jpg',
      title: 'Title de Slide 3',
      text: 'Lorem10',
    },
  ];
  return (
    <Carousel
      className=" carousel slide"
      autoPlay
      interval={6000}
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
    >
      {data.map((slide) => (
        <div key={slide.id}>
          <img className="d-block w-100" src={slide.image} alt="" />
          <div className="overlay">
            <div className="overlay__title">{slide.title}</div>
            <div className="overlay__text">{slide.text}</div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
export default Slider;
