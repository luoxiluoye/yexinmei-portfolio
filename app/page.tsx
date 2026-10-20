import { ApprovedHome } from "@/components/professional/approved-home";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata = buildPageMetadata({"title": "个人履历与实践记录", "description": "罗叶馨梅，电子科技大学新闻与传播硕士在读、2027 届毕业生。校园宣传、文字采编与组织协调实践。", "path": "/"});

export default function Page() {
  return <ApprovedHome />;
}
