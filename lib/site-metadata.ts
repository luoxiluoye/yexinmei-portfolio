import type { Metadata } from "next";

export const SITE_URL = "https://yexinmei-portfolio.vercel.app";
const OG_IMAGE = "/opengraph-image";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const absoluteUrl = new URL(normalizedPath, SITE_URL).toString();
  const fullTitle = `${title} | 罗叶馨梅`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: normalizedPath,
    },
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: absoluteUrl,
      siteName: "YEXINMEI LUO",
      title: fullTitle,
      description,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "罗叶馨梅个人作品集",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
