import { useEffect, useState } from "react";

import type { AmbientTheme } from "#/components/atoms/ambient-theme-toggle";
import { AboutSection } from "#/components/organisms/about-section";
import { ContactSection } from "#/components/organisms/contact-section";
import { ExperienceSection } from "#/components/organisms/experience-section";
import { Footer } from "#/components/organisms/footer";
import { Hero } from "#/components/organisms/hero";
import { Navbar } from "#/components/organisms/navbar";
import { TechStackSection } from "#/components/organisms/tech-stack-section";

export function PortfolioTemplate() {
	const [ambientTheme, setAmbientTheme] = useState<AmbientTheme>("moon");
	const toggleAmbientTheme = () =>
		setAmbientTheme((current) => (current === "sun" ? "moon" : "sun"));

	useEffect(() => {
		document.documentElement.dataset.ambientTheme = ambientTheme;
	}, [ambientTheme]);

	return (
		<div
			data-ambient-theme={ambientTheme}
			className="relative min-h-screen bg-transparent text-zinc-100 transition-colors duration-300"
		>
			<Navbar theme={ambientTheme} onThemeToggle={toggleAmbientTheme} />
			<main className="relative z-10">
				<Hero theme={ambientTheme} />
				<AboutSection />
				<ExperienceSection />
				<TechStackSection />
				<ContactSection />
			</main>
			<Footer />
		</div>
	);
}
