'use client'

import { useState, useEffect } from 'react'

const words = ['Fast', 'Smarter', 'Properly']

export function RotatingText() {
  const [index, setIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length)
        setIsAnimating(false)
      }, 300)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className={`text-red-500 inline-block transition-all duration-300 ${
        isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      {words[index]}
    </span>
  )
}
