/**
 * Typed question bank for the "Find your research protocol" guided finder.
 * The quiz engine (`@/lib/quiz-engine`) reads the `tags` an option contributes
 * and the structural answers (complexity, cycle, budget, storage) to rank
 * compounds from `MOCK_PRODUCTS` into a primary + supporting protocol.
 */

/** Peptide-matching tags an answer option can contribute. */
export type ProtocolTag =
  | "tissue-repair"
  | "metabolic"
  | "sleep-recovery"
  | "performance"
  | "anti-aging";

export type QuizInputKind = "radio" | "multi" | "slider";

export interface QuizOption {
  id: string;
  label: string;
  /** Optional helper line shown under the label. */
  detail?: string;
  /** Tags this option contributes to the matching engine. */
  tags?: ProtocolTag[];
  /** Structural value for non-tag questions (experience, complexity, etc.). */
  value?: string;
}

export interface QuizQuestion {
  id: string;
  /** Stable key used to read the answer back out of the answer map. */
  key:
    | "focus"
    | "experience"
    | "complexity"
    | "cycle"
    | "budget"
    | "storage";
  prompt: string;
  helper?: string;
  kind: QuizInputKind;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    key: "focus",
    prompt: "What's your research focus?",
    helper: "Select all that apply — the result weights toward your primary interest.",
    kind: "multi",
    options: [
      {
        id: "tissue",
        label: "Tissue repair",
        detail: "Connective tissue, gut lining, and recovery models.",
        tags: ["tissue-repair"],
      },
      {
        id: "metabolic",
        label: "Metabolic",
        detail: "Glucose handling, body-composition, and lipid pathways.",
        tags: ["metabolic"],
      },
      {
        id: "sleep",
        label: "Sleep & recovery",
        detail: "Slow-wave sleep and GH-pulse recovery models.",
        tags: ["sleep-recovery"],
      },
      {
        id: "performance",
        label: "Performance",
        detail: "Growth-factor signaling and work-capacity models.",
        tags: ["performance"],
      },
      {
        id: "anti-aging",
        label: "Anti-aging",
        detail: "Telomere, mitochondrial, and skin-matrix research.",
        tags: ["anti-aging"],
      },
    ],
  },
  {
    id: "q2",
    key: "experience",
    prompt: "Subject experience level?",
    helper: "Calibrates protocol complexity and supporting-compound count.",
    kind: "radio",
    options: [
      { id: "first", label: "First protocol", detail: "New to reconstitution and dosing logs.", value: "first" },
      { id: "some", label: "Some experience", detail: "Comfortable with single-peptide protocols.", value: "some" },
      { id: "advanced", label: "Advanced", detail: "Runs multi-compound stacks with cycling.", value: "advanced" },
    ],
  },
  {
    id: "q3",
    key: "complexity",
    prompt: "Preferred reconstitution complexity?",
    helper: "Drives how many compounds the recommended protocol includes.",
    kind: "radio",
    options: [
      { id: "single", label: "Single peptide", detail: "One vial, one reconstitution.", value: "single" },
      { id: "stack", label: "2–3 peptide stack", detail: "A primary plus one or two supporting compounds.", value: "stack" },
      { id: "complex", label: "Complex 4+", detail: "Layered protocol with multiple reconstitutions.", value: "complex" },
    ],
  },
  {
    id: "q4",
    key: "cycle",
    prompt: "Cycle length preference?",
    helper: "Informs pack sizing in the result.",
    kind: "radio",
    options: [
      { id: "4w", label: "4-week", detail: "Short observation window.", value: "4" },
      { id: "8w", label: "8-week", detail: "Standard research cycle.", value: "8" },
      { id: "12w", label: "12-week", detail: "Extended longitudinal window.", value: "12" },
    ],
  },
  {
    id: "q5",
    key: "budget",
    prompt: "Budget per protocol?",
    helper: "Filters the recommendation to compounds within range.",
    kind: "slider",
    options: [
      { id: "b1", label: "$100–$200", value: "200" },
      { id: "b2", label: "$200–$500", value: "500" },
      { id: "b3", label: "$500–$1000", value: "1000" },
      { id: "b4", label: "$1000+", value: "9999" },
    ],
  },
  {
    id: "q6",
    key: "storage",
    prompt: "Storage capacity?",
    helper: "Confirms you can hold compounds at the recommended temperature.",
    kind: "radio",
    options: [
      { id: "fridge", label: "Standard fridge", detail: "2–8°C only.", value: "fridge" },
      { id: "freezer", label: "Lab freezer", detail: "−20°C available.", value: "freezer" },
      { id: "both", label: "Both", detail: "Refrigerated and frozen storage.", value: "both" },
    ],
  },
];

/** Total non-email steps (intro is step 0, questions are 1..N). */
export const QUIZ_STEP_COUNT = QUIZ_QUESTIONS.length;
