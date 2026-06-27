"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PprQuizShell from "@/components/quiz/PprQuizShell";
import PprQuizIntro from "@/components/quiz/PprQuizIntro";
import PprQuizQuestion from "@/components/quiz/PprQuizQuestion";
import PprQuizEmailCapture from "@/components/quiz/PprQuizEmailCapture";
import PprQuizResult from "@/components/quiz/PprQuizResult";
import { QUIZ_QUESTIONS, QUIZ_STEP_COUNT, type QuizQuestion } from "@/lib/quizQuestions";
import { recommendProtocol, type QuizAnswers } from "@/lib/quiz-engine";

type Phase = "intro" | "questions" | "email" | "result";

interface PersistedState {
  phase: Phase;
  stepIndex: number;
  answers: Record<string, string[]>;
  email: string | null;
}

const STORAGE_KEY = "nexphoria-quiz-v1";

const EMPTY_ANSWERS: Record<string, string[]> = {};

function loadPersisted(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export default function QuizClient() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>(EMPTY_ANSWERS);
  const [email, setEmail] = useState<string | null>(null);
  const [saved, setSaved] = useState<PersistedState | null>(() => {
    if (typeof window === "undefined") return null;
    const persisted = loadPersisted();
    return persisted && persisted.phase !== "intro" ? persisted : null;
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setHydrated(true);
  }, []);

  // Persist on every meaningful change.
  useEffect(() => {
    if (!hydrated) return;
    if (phase === "intro") {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    const state: PersistedState = { phase, stepIndex, answers, email };
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — quiz still works in-memory */
    }
  }, [hydrated, phase, stepIndex, answers, email]);

  const question = QUIZ_QUESTIONS[stepIndex];
  const selected = useMemo(() => (question ? answers[question.key] ?? [] : []), [question, answers]);

  const setSelection = useCallback(
    (ids: string[]) => {
      if (!question) return;
      setAnswers((prev) => ({ ...prev, [question.key]: ids }));
    },
    [question],
  );

  const quizAnswers: QuizAnswers = useMemo(
    () => ({
      focus: answers.focus ?? [],
      experience: answers.experience?.[0],
      complexity: answers.complexity?.[0],
      cycle: optionValue("q4", answers.cycle?.[0]),
      budget: optionValue("q5", answers.budget?.[0]),
      storage: answers.storage?.[0],
    }),
    [answers],
  );

  const result = useMemo(
    () => (phase === "result" ? recommendProtocol(quizAnswers) : null),
    [phase, quizAnswers],
  );

  const start = () => {
    setAnswers(EMPTY_ANSWERS);
    setEmail(null);
    setStepIndex(0);
    setPhase("questions");
  };

  const resume = () => {
    if (!saved) return;
    setPhase(saved.phase);
    setStepIndex(saved.stepIndex);
    setAnswers(saved.answers);
    setEmail(saved.email);
  };

  const restart = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setSaved(null);
    setPhase("intro");
    setStepIndex(0);
    setAnswers(EMPTY_ANSWERS);
    setEmail(null);
  };

  const back = () => {
    if (phase === "email") {
      setPhase("questions");
      setStepIndex(QUIZ_STEP_COUNT - 1);
      return;
    }
    if (stepIndex === 0) {
      setPhase("intro");
      return;
    }
    setStepIndex((i) => i - 1);
  };

  const next = () => {
    if (stepIndex < QUIZ_STEP_COUNT - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    setPhase("email");
  };

  if (!hydrated) return <div className="min-h-[60vh]" aria-hidden="true" />;

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:py-24">
      {phase === "intro" && (
        <PprQuizIntro onStart={start} hasSavedProgress={Boolean(saved)} onResume={resume} />
      )}

      {phase === "questions" && question && (
        <PprQuizShell
          stepKey={question.id}
          current={stepIndex + 1}
          total={QUIZ_STEP_COUNT}
          canBack
          canNext={selected.length > 0}
          nextLabel={stepIndex === QUIZ_STEP_COUNT - 1 ? "See your protocol" : "Continue"}
          onBack={back}
          onNext={next}
        >
          <PprQuizQuestion question={question} selected={selected} onChange={setSelection} />
        </PprQuizShell>
      )}

      {phase === "email" && (
        <PprQuizShell
          stepKey="email"
          current={QUIZ_STEP_COUNT}
          total={QUIZ_STEP_COUNT}
          canBack
          canNext={false}
          onBack={back}
          onNext={() => setPhase("result")}
        >
          <PprQuizEmailCapture
            onSubmit={(value) => {
              setEmail(value);
              setPhase("result");
            }}
            onSkip={() => setPhase("result")}
          />
        </PprQuizShell>
      )}

      {phase === "result" && result && (
        <PprQuizResult result={result} email={email} onRestart={restart} />
      )}
    </div>
  );
}

/** Resolve a question's selected option id to its typed `value`. */
function optionValue(questionId: string, optionId: string | undefined): string | undefined {
  if (!optionId) return undefined;
  const q: QuizQuestion | undefined = QUIZ_QUESTIONS.find((x) => x.id === questionId);
  return q?.options.find((o) => o.id === optionId)?.value;
}
