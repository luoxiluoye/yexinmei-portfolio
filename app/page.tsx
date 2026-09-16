import { AboutPreview } from "@/components/home/about-preview";
import { FlagshipRedLeaf } from "@/components/home/flagship-red-leaf";
import { HeroSection } from "@/components/home/hero-section";
import { SelectedWork } from "@/components/home/selected-work";

export default function HomePage() {
  return (
    <main id="main-content" className="studio-home site-container">
      <HeroSection />
      <FlagshipRedLeaf />
      <SelectedWork />
      <AboutPreview />
    </main>
  );
}
