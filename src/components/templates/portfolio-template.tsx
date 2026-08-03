import { AboutSection } from "#/components/organisms/about-section";
import { ContactSection } from "#/components/organisms/contact-section";
import { CursorLight } from "#/components/organisms/cursor-light";
import { ExperienceSection } from "#/components/organisms/experience-section";
import { Footer } from "#/components/organisms/footer";
import { Hero } from "#/components/organisms/hero";
import { Navbar } from "#/components/organisms/navbar";
import { TechStackSection } from "#/components/organisms/tech-stack-section";

export function PortfolioTemplate() {
	return (
		<div className="relative min-h-screen bg-transparent text-zinc-100">
			<CursorLight />
			<Navbar />
			<main className="relative z-10">
				<Hero />
				<AboutSection />
				<ExperienceSection />
				<TechStackSection />
				<ContactSection />
			</main>
			<Footer />
		</div>
	);
}
