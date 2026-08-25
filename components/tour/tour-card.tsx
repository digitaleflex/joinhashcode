"use client"

import type { CardComponentProps } from "nextstepjs"

export function TourCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) {
  return (
    <div
      className="relative bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 max-w-[calc(100vw-2rem)] min-w-[280px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
    >
      {arrow}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {step.icon && <span className="text-lg">{step.icon}</span>}
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-bold">
            Étape {currentStep + 1}/{totalSteps}
          </span>
        </div>
        <button
          onClick={skipTour}
          className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          Passer
        </button>
      </div>

      {/* Content */}
      <h3 className="text-sm font-bold text-white mb-1 tracking-tight">
        {step.title}
      </h3>
      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
        {typeof step.content === "string" ? step.content : step.content}
      </p>

      {/* Progress dots — scrollable on mobile if too many */}
      <div className="flex items-center justify-center gap-1.5 mb-4 overflow-x-auto max-w-full">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 shrink-0 ${
              i === currentStep
                ? "w-6 bg-primary"
                : i < currentStep
                  ? "w-1.5 bg-primary/40"
                  : "w-1.5 bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Navigation — min 44px touch targets */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${
            currentStep > 0
              ? "text-zinc-400 hover:text-white hover:bg-white/5"
              : "text-zinc-700 cursor-not-allowed"
          }`}
          disabled={currentStep === 0}
        >
          ←
        </button>
        <button
          onClick={nextStep}
          className="min-h-[44px] px-5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest bg-primary text-black hover:bg-primary/90 transition-all shadow-[0_0_10px_rgba(197,244,65,0.3)] hover:shadow-[0_0_20px_rgba(197,244,65,0.5)]"
        >
          {currentStep === totalSteps - 1 ? "Terminer" : "Suivant →"}
        </button>
      </div>
    </div>
  )
}
