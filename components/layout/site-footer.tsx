import { Link } from "next-view-transitions";

import { FooterCatEasterEgg } from "@/components/game/footer-cat-easter-egg";

export function SiteFooter() {
  return (
    <footer className="portfolio-footer">
      <div className="site-container">
        <div className="portfolio-footer-main">
          <div>
            <p className="portfolio-footer-eyebrow">LET’S TALK</p>
            <p className="portfolio-footer-invitation">让有趣的想法，继续发生。</p>
          </div>

          <Link href="/contact" className="portfolio-footer-contact">
            <span>联系我</span>
            <span aria-hidden="true">↗</span>
          </Link>

          <div className="portfolio-footer-cat">
            <FooterCatEasterEgg />
          </div>
        </div>

        <div className="portfolio-footer-bottom">
          <span>© 2026 Yexinmei Luo</span>
          <span>Stay curious. Keep building. Make impact.</span>
        </div>
      </div>
    </footer>
  );
}
