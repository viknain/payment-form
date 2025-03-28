"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CreditCardProps {
  cardNumber: string
  expiryDate: string
  cvv: string
  isFlipped: boolean
}

export default function CreditCard({ cardNumber, expiryDate, cvv, isFlipped }: CreditCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    if (isFlipped !== showBack) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setShowBack(isFlipped)
      }, 150) // Half of the animation duration

      const animationTimer = setTimeout(() => {
        setIsAnimating(false)
      }, 300) // Full animation duration

      return () => {
        clearTimeout(timer)
        clearTimeout(animationTimer)
      }
    }
  }, [isFlipped, showBack])

  const formatCardNumberDisplay = (num: string) => {
    const cleaned = num.replace(/\s/g, "")
    let display = ""

    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        display += " "
      }

      if (i < cleaned.length) {
        // Show only the last 4 digits, mask the rest
        if (i >= 12 || cleaned.length < 4) {
          display += cleaned[i]
        } else {
          display += "•"
        }
      } else {
        display += "•"
      }
    }

    return display
  }

  return (
    <div className="perspective-1000 w-full max-w-[330px] relative">
      <div
        className={cn(
          "w-full h-full transition-all duration-300 transform-style-preserve-3d relative  max-w-[300px] h-[210px]",
          showBack ? "rotate-y-180" : "rotate-y-0",
        )}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          
        }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full rounded-xl p-6 flex flex-col justify-between bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 text-white shadow-xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
            background: "linear-gradient(300deg, #a78bfa, #fbcfe8, #fde68a)",
          }}
        >
          <div>
            <div className="text-white font-light text-sm">Balance</div>
            <div className="text-white font-semibold text-lg">$5,756</div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start  items-center">
            <div className="font-mono text-base tracking-wider">
              {formatCardNumberDisplay(cardNumber || "•••• •••• •••• ••••")}
            </div>
            <div className="w-12">
                <img src="/sim.svg?height=30&width=40" alt="Visa" className="w-full" />
              </div>
              </div>

            <div className="flex justify-between items-end">
              <div className="text-[10px] opacity-80">
                <p className="[text-shadow:_0_2px_4px_rgb(99_102_241_/_0.8)]">CARD HOLDER</p>
                <p className="text-xs ">John Doe</p>
              </div>

              <div className="text-[10px] opacity-80">
                <p className="[text-shadow:_0_2px_4px_rgb(99_102_241_/_0.8)]">EXPIRES</p>
                <p className="text-xs">{expiryDate || "MM/YYYY"}</p>
              </div>

              <div className="w-12">
              <img src="/visa.svg?height=30&width=40" alt="Visa" className="w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 text-white shadow-xl flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(300deg, #a78bfa, #fbcfe8, #fde68a)",
          }}
        >
          <div className="w-full h-12 bg-black/80 mt-6"></div>

          <div className="px-6 pb-6 space-y-4">
            <div className="flex items-center justify-end space-x-2">
              <div className="bg-white/90 text-gray-800 h-10 flex-1 flex items-center px-3 rounded">
                <div className="ml-auto font-mono tracking-wider">{cvv || "•••"}</div>
              </div>
              <div className="text-xs">
                <p>CVV</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xl font-semibold text-white/80 mt-8 mb-8">
              To confirm your appointment please provide some additional information
      </p>
    </div>
  )
}

