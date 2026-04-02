export type EIDimensionKey =
  | "selfAwareness"
  | "selfRegulation"
  | "motivation"
  | "empathy"
  | "socialSkills";

export type DimensionIconName =
  | "Sparkles"
  | "ShieldCheck"
  | "Rocket"
  | "HeartHandshake"
  | "Users";

export type EIDimension = {
  key: EIDimensionKey;
  title: string;
  description: string;
  icon: DimensionIconName;
  color: string;
};

export type AssessmentStep = {
  key:
    | EIDimensionKey
    | "workplaceEffectiveness";
  title: string;
  description: string;
  questionIds: number[];
};

export type AssessmentQuestion = {
  id: number;
  text: string;
  section: "partA" | "partB";
  dimension?: EIDimensionKey;
  category?: "performance" | "teamwork" | "leadership" | "conflictResolution";
};

export const EI_DIMENSIONS: EIDimension[] = [
  {
    key: "selfAwareness",
    title: "Self-Awareness",
    description:
      "Ability to recognize and understand your own emotions and their impact.",
    icon: "Sparkles",
    color: "from-sky-500 to-cyan-500",
  },
  {
    key: "selfRegulation",
    title: "Self-Regulation",
    description:
      "Ability to control impulses, manage stress, and adapt to changes.",
    icon: "ShieldCheck",
    color: "from-indigo-500 to-blue-500",
  },
  {
    key: "motivation",
    title: "Motivation",
    description:
      "Internal drive to achieve goals and stay resilient despite challenges.",
    icon: "Rocket",
    color: "from-violet-500 to-indigo-500",
  },
  {
    key: "empathy",
    title: "Empathy",
    description: "Ability to understand and share the feelings of others.",
    icon: "HeartHandshake",
    color: "from-blue-500 to-violet-500",
  },
  {
    key: "socialSkills",
    title: "Social Skills",
    description:
      "Ability to communicate, collaborate, and manage relationships effectively.",
    icon: "Users",
    color: "from-cyan-500 to-indigo-500",
  },
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    section: "partA",
    dimension: "selfAwareness",
    text: "I can easily recognize and name my emotions as I experience them.",
  },
  {
    id: 2,
    section: "partA",
    dimension: "selfAwareness",
    text: "When I receive negative feedback, I understand why it affects me.",
  },
  {
    id: 3,
    section: "partA",
    dimension: "selfAwareness",
    text: "I am aware of how my mood impacts my behavior at work.",
  },
  {
    id: 4,
    section: "partA",
    dimension: "selfAwareness",
    text: "I understand my strengths and weaknesses clearly.",
  },
  {
    id: 5,
    section: "partA",
    dimension: "selfAwareness",
    text: "I can identify physical signs of stress before important situations.",
  },
  {
    id: 6,
    section: "partA",
    dimension: "selfRegulation",
    text: "I think before I speak when I am upset.",
  },
  {
    id: 7,
    section: "partA",
    dimension: "selfRegulation",
    text: "I remain calm when dealing with difficult people.",
  },
  {
    id: 8,
    section: "partA",
    dimension: "selfRegulation",
    text: "I avoid making impulsive decisions under pressure.",
  },
  {
    id: 9,
    section: "partA",
    dimension: "selfRegulation",
    text: "I adapt quickly to unexpected changes.",
  },
  {
    id: 10,
    section: "partA",
    dimension: "selfRegulation",
    text: "I manage stress effectively during deadlines.",
  },
  {
    id: 11,
    section: "partA",
    dimension: "motivation",
    text: "I stay focused on goals despite obstacles.",
  },
  {
    id: 12,
    section: "partA",
    dimension: "motivation",
    text: "I learn from failure instead of giving up.",
  },
  {
    id: 13,
    section: "partA",
    dimension: "motivation",
    text: "I actively seek opportunities to improve myself.",
  },
  {
    id: 14,
    section: "partA",
    dimension: "motivation",
    text: "I recover quickly from setbacks.",
  },
  {
    id: 15,
    section: "partA",
    dimension: "motivation",
    text: "I enjoy completing challenging tasks.",
  },
  {
    id: 16,
    section: "partA",
    dimension: "empathy",
    text: "I can sense others' emotions even when not expressed.",
  },
  {
    id: 17,
    section: "partA",
    dimension: "empathy",
    text: "I support colleagues facing personal difficulties.",
  },
  {
    id: 18,
    section: "partA",
    dimension: "empathy",
    text: "I consider others' perspectives before making decisions.",
  },
  {
    id: 19,
    section: "partA",
    dimension: "empathy",
    text: "I understand customer concerns easily.",
  },
  {
    id: 20,
    section: "partA",
    dimension: "empathy",
    text: "I notice team morale and emotional climate.",
  },
  {
    id: 21,
    section: "partA",
    dimension: "socialSkills",
    text: "I communicate ideas clearly and respectfully.",
  },
  {
    id: 22,
    section: "partA",
    dimension: "socialSkills",
    text: "I help resolve conflicts in group settings.",
  },
  {
    id: 23,
    section: "partA",
    dimension: "socialSkills",
    text: "I build strong professional relationships.",
  },
  {
    id: 24,
    section: "partA",
    dimension: "socialSkills",
    text: "I encourage participation in group discussions.",
  },
  {
    id: 25,
    section: "partA",
    dimension: "socialSkills",
    text: "I work well with different personalities.",
  },
  {
    id: 26,
    section: "partB",
    category: "performance",
    text: "I meet or exceed my work targets consistently.",
  },
  {
    id: 27,
    section: "partB",
    category: "performance",
    text: "My emotional control improves my work quality.",
  },
  {
    id: 28,
    section: "partB",
    category: "teamwork",
    text: "I contribute to a positive team environment.",
  },
  {
    id: 29,
    section: "partB",
    category: "teamwork",
    text: "Others seek my support or advice.",
  },
  {
    id: 30,
    section: "partB",
    category: "teamwork",
    text: "I build trust quickly with team members.",
  },
  {
    id: 31,
    section: "partB",
    category: "leadership",
    text: "I motivate others toward common goals.",
  },
  {
    id: 32,
    section: "partB",
    category: "leadership",
    text: "People rely on me during challenges.",
  },
  {
    id: 33,
    section: "partB",
    category: "conflictResolution",
    text: "I handle conflicts professionally.",
  },
  {
    id: 34,
    section: "partB",
    category: "conflictResolution",
    text: "I de-escalate tense situations effectively.",
  },
  {
    id: 35,
    section: "partB",
    category: "conflictResolution",
    text: "I aim for win-win solutions.",
  },
];

export const PART_A_QUESTION_IDS = ASSESSMENT_QUESTIONS.filter(
  (question) => question.section === "partA",
).map((question) => question.id);

export const PART_B_QUESTION_IDS = ASSESSMENT_QUESTIONS.filter(
  (question) => question.section === "partB",
).map((question) => question.id);

export const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
] as const;

export const QUESTION_STEPS: AssessmentStep[] = [
  {
    key: "selfAwareness",
    title: "Self-Awareness",
    description:
      "Explore how well you understand your emotions and their effect on your work behavior.",
    questionIds: [1, 2, 3, 4, 5],
  },
  {
    key: "selfRegulation",
    title: "Self-Regulation",
    description:
      "Evaluate your ability to stay composed, control impulses, and handle pressure.",
    questionIds: [6, 7, 8, 9, 10],
  },
  {
    key: "motivation",
    title: "Motivation",
    description:
      "Assess your resilience, goal focus, and drive to improve through challenges.",
    questionIds: [11, 12, 13, 14, 15],
  },
  {
    key: "empathy",
    title: "Empathy",
    description:
      "Understand how effectively you detect and respond to other people's emotions.",
    questionIds: [16, 17, 18, 19, 20],
  },
  {
    key: "socialSkills",
    title: "Social Skills",
    description:
      "Measure communication, collaboration, conflict navigation, and relationship building.",
    questionIds: [21, 22, 23, 24, 25],
  },
  {
    key: "workplaceEffectiveness",
    title: "Workplace Effectiveness",
    description:
      "Capture how emotional behavior translates into performance, teamwork, leadership, and conflict resolution.",
    questionIds: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
  },
];
