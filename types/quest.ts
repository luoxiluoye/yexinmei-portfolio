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

export type QuestRealCase = {
  title: string;
  summary: string;
  steps?: string[];
};

export type Quest = {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  status: QuestStatus;
  role: string;
  period: string;
  platform: string;
  categories: string[];
  summary: string;
  objective: string;
  challenge: string;
  actions: string[];
  realCase?: QuestRealCase;
  outcomes: string[];
  outcomeMetrics?: QuestMetric[];
  tools: string[];
  learnings: string;
  gallery: QuestGalleryItem[];
  mediaStatus?: "LATER";
};
