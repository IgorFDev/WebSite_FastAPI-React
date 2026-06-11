import { useEffect, useState } from 'react'
import './HeroCarousel.css'

const slides = [
  '/images/team1.jpg',
  '/images/team2.jpg',
  '/images/team3.jpg',
]

function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === slides.length - 1) {
          return 0
        }

        return prev + 1
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hero">
      <img
        src={slides[currentSlide]}
        alt="team"
        className="hero__image"
      />

      <div className="hero__indicators">
        {slides.map((_, index) => (
          <div
            key={index}
            className={
              index === currentSlide
                ? 'hero__indicator active'
                : 'hero__indicator'
            }
          />
        ))}
      </div>
    </section>
  )
}

export default HeroCarousel