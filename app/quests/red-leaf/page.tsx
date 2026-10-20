import { PracticeDetail } from "@/components/professional/practice-details";
import { getPracticeRecord } from "@/components/professional/resume-content";
import { buildPageMetadata } from "@/lib/site-metadata";

const record = getPracticeRecord("red-leaf")!;
export const metadata = buildPageMetadata({ title: record.title, description: record.summary, path: "/quests/red-leaf" });

export default function Page() {
  return <PracticeDetail slug="red-leaf" />;
}
