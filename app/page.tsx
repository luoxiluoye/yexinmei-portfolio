import { HeroSection } from "@/components/home/hero-section";
import { SelectedWork } from "@/components/home/selected-work";
import { AboutPreview } from "@/components/home/about-preview";
export default function HomePage() {
    return <main id="main-content" className="studio-home site-container"><HeroSection /><SelectedWork /><AboutPreview /></main>;
}
