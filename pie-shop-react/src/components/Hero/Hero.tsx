/**
 * Hero Component - React version of hero carousel
 * Converts vanilla JS carousel logic to React
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: HeroSlide[] = [
    {
      id: 0,
      image: '/images/Hero/hero1.jpg',
      title: 'Welcome to Bethany\'s Cafe',
      description: 'Handcrafted pies made with love.',
      buttonText: 'Shop Now',
      buttonLink: '#pies'
    },
    {
      id: 1,
      image: '/images/Hero/hero2.jpg',
      title: 'Pumpkin Pie',
      description: 'Perfect for any holiday gathering',
      buttonText: 'View Seasonal',
      buttonLink: '/seasonal'
    },
    {
      id: 2,
      image: '/images/Hero/hero3.jpg',
      title: 'Chocolate Pecan Pie',
      description: 'A delicious twist on a classic favorite',
      buttonText: 'Browse Menu',
      buttonLink: '/fruit'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            data-index={index}
          >
            <img src={slide.image} alt={slide.title} />
            <div className="hero-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <Link to={slide.buttonLink} className="btn-primary">
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="hero-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
