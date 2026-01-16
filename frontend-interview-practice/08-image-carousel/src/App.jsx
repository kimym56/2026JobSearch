import { useState } from 'react'
import './App.css'

const images = [
  { id: 1, url: 'https://picsum.photos/800/400?random=1', alt: 'Image 1' },
  { id: 2, url: 'https://picsum.photos/800/400?random=2', alt: 'Image 2' },
  { id: 3, url: 'https://picsum.photos/800/400?random=3', alt: 'Image 3' },
  { id: 4, url: 'https://picsum.photos/800/400?random=4', alt: 'Image 4' },
  { id: 5, url: 'https://picsum.photos/800/400?random=5', alt: 'Image 5' }
]

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? 0 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? prev : prev + 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Image Carousel</h1>

        <div className="carousel">
          <button
            className="carousel-button prev"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            ‹
          </button>

          <div className="carousel-content">
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].alt}
              className="carousel-image"
            />
          </div>

          <button
            className="carousel-button next"
            onClick={goToNext}
            disabled={currentIndex === images.length - 1}
          >
            ›
          </button>
        </div>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
