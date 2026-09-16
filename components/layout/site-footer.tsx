import { Link } from "next-view-transitions";

import { FooterCatEasterEgg } from "@/components/game/footer-cat-easter-egg";

export function SiteFooter() {
  return (
    <footer className="portfolio-footer">
      <div className="site-container">
        <div className="portfolio-footer-main">
          <div>
            <p className="font-pixel portfolio-footer-eyebrow">THE NEXT CHAPTER</p>
            <p className="portfolio-footer-invitation">好故事，从一次交流开始。</p>
          </div>
          <Link href="/contact" className="portfolio-footer-contact">
            <span>联系我</span><span aria-hidden="true">↗</span>
          </Link>
          <div className="portfolio-footer-cat"><FooterCatEasterEgg /></div>
        </div>
        <div className="portfolio-footer-bottom">
          <span>© 2026 罗叶馨梅</span>
          <span className="font-pixel">STAY CURIOUS. KEEP CREATING.</span>
        </div>
      </div>
    </footer>
  );
}
