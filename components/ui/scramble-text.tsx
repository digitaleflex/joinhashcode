"use client"

import { useState, useEffect } from "react"

const CHARS = "01$#%&>|~_-"

export function ScrambleText({ 
  text, 
  duration = 1500,
  className = "" 
}: { 
  text: string, 
  duration?: number,
  className?: string
}) {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    let frame = 0
    let animationFrameId: number
    const totalFrames = Math.max(Math.floor(duration / 16), 1) // ~60fps
    
    const animate = () => {
      frame++
      const progress = frame / totalFrames
      
      let scrambled = ""
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          scrambled += " "
          continue
        }
        // If progress passed the character threshold, show real letter
        // otherwise show random character
        if (progress > i / text.length) {
          scrambled += text[i]
        } else {
          scrambled += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
      }
      
      setDisplayText(scrambled)
      
      if (frame < totalFrames) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setDisplayText(text)
      }
    }
    
    animationFrameId = requestAnimationFrame(animate)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [text, duration])

  return <span className={className}>{displayText}</span>
}
