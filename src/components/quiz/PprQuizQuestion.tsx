"use client";

import { Check } from "lucide-react";
import type { QuizQuestion } from "@/lib/quizQuestions";

interface PprQuizQuestionProps {
  question: QuizQuestion;
  /** Selected option ids (single-element array for radio/slider). */
  selected: string[];
  onChange: (ids: string[]) => void;
}

export default function PprQuizQuestion({ question, selected, onChange }: PprQuizQuestionProps) {
  const toggleMulti = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[24px] font-semibold lg:text-[30px]"
          style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
        >
          {question.prompt}
        </h2>
        {question.helper && (
          <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
            {question.helper}
          </p>
        )}
      </div>

      {question.kind === "slider" ? (
        <SliderInput question={question} selected={selected} onChange={onChange} />
      ) : (
        <div className="flex flex-col gap-2.5" role={question.kind === "radio" ? "radiogroup" : "group"} aria-label={question.prompt}>
          {question.options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                role={question.kind === "radio" ? "radio" : "checkbox"}
                aria-checked={isSelected}
                onClick={() => (question.kind === "multi" ? toggleMulti(opt.id) : onChange([opt.id]))}
                className="flex items-start gap-3 rounded-lg px-4 py-3.5 text-left transition-colors focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: isSelected ? "color-mix(in srgb, var(--accent) 10%, var(--ink-2))" : "var(--ink-2)",
                  border: `1px solid ${isSelected ? "var(--accent)" : "var(--steel)"}`,
                }}
              >
                <span
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center"
                  style={{
                    borderRadius: question.kind === "multi" ? 5 : 999,
                    border: `1.5px solid ${isSelected ? "var(--accent)" : "var(--silver-3)"}`,
                    backgroundColor: isSelected ? "var(--accent)" : "transparent",
                  }}
                >
                  {isSelected && <Check size={13} aria-hidden="true" style={{ color: "var(--ink)" }} strokeWidth={3} />}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-medium" style={{ fontFamily: "var(--font-body)", color: "var(--platinum)" }}>
                    {opt.label}
                  </span>
                  {opt.detail && (
                    <span className="text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)" }}>
                      {opt.detail}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SliderInput({ question, selected, onChange }: PprQuizQuestionProps) {
  const idx = Math.max(0, question.options.findIndex((o) => o.id === selected[0]));
  const current = question.options[idx] ?? question.options[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <span
          className="text-[28px] font-semibold lg:text-[36px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
        >
          {current.label}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={question.options.length - 1}
        step={1}
        value={idx}
        onChange={(e) => onChange([question.options[Number(e.target.value)].id])}
        aria-label={question.prompt}
        aria-valuetext={current.label}
        className="w-full"
        style={{ accentColor: "var(--accent)" }}
      />
      <div className="flex justify-between">
        {question.options.map((opt) => (
          <span
            key={opt.id}
            className="text-[11px]"
            style={{ fontFamily: "var(--font-mono)", color: opt.id === current.id ? "var(--accent)" : "var(--silver-3)" }}
          >
            {opt.label}
          </span>
        ))}
      </div>
    </div>
  );
}
