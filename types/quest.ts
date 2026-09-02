export type QuestStatus = "ACTIVE" | "ONGOING" | "COMPLETED";

export type QuestMetric = {
  value: string;
  label: string;
  description?: string;
};

export type QuestGalleryItem = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type Quest = {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  status: QuestStatus;
  role: string;
  period: string;
  categories: string[];
  summary: string;
  objective: string;
  challenge: string;
  actions: string[];
  outcomes: string[];
  outcomeMetrics?: QuestMetric[];
  tools: string[];
  learnings: string;
  gallery: QuestGalleryItem[];
  mediaStatus?: "LATER";
};
