import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { Reveal } from "#/components/molecules/reveal";
import { SectionHeading } from "#/components/molecules/section-heading";
import { technologyMarquee } from "#/constants/portfolio";

const gridSlotIds = [
	"stack-card-one",
	"stack-card-two",
	"stack-card-three",
	"stack-card-four",
	"stack-card-five",
	"stack-card-six",
	"stack-card-seven",
	"stack-card-eight",
	"stack-card-nine",
	"stack-card-ten",
	"stack-card-eleven",
	"stack-card-twelve",
] as const;

function SkillIcon({
	skillIcon,
	logoUrl,
}: {
	skillIcon: string;
	logoUrl?: string;
}) {
	return (
		<img
			className="h-full w-full object-contain"
			src={logoUrl ?? `https://skillicons.dev/icons?i=${skillIcon}&theme=dark`}
			alt=""
			width="32"
			height="32"
			loading="lazy"
		/>
	);
}

function TechnologyMarquee() {
	const createRibbonItems = (technologies: typeof technologyMarquee) =>
		technologies.map((technology) => ({ ...technology, id: technology.name }));
	const upperItems = createRibbonItems(
		technologyMarquee.filter((_, index) => index % 2 === 0),
	);
	const lowerItems = createRibbonItems(
		technologyMarquee.filter((_, index) => index % 2 === 1),
	);

	return (
		<section className="tech-ribbons" aria-label="Tecnologias que uso">
			<div className="tech-ribbon tech-ribbon-back">
				<RibbonItems items={upperItems} />
			</div>
			<div className="tech-ribbon tech-ribbon-front">
				<RibbonItems items={lowerItems} />
			</div>
		</section>
	);
}

function RibbonItems({
	items,
}: {
	items: Array<(typeof technologyMarquee)[number] & { id: string }>;
}) {
	return (
		<div className="tech-marquee-track flex w-max items-center gap-4 px-4">
			{items.map((technology) => (
				<div
					key={technology.id}
					className="flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950/55 px-4 py-3"
				>
					<span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20">
						<SkillIcon
							skillIcon={technology.skillIcon}
							logoUrl={technology.logoUrl}
						/>
					</span>
					<div>
						<div className="text-sm font-medium text-white">
							{technology.name}
						</div>
						<div className="text-xs text-zinc-400">
							{technology.description}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function TechnologyGrid() {
	const [slotItems, setSlotItems] = useState(() =>
		technologyMarquee.slice(0, gridSlotIds.length),
	);

	useEffect(() => {
		let slotIndex = 0;
		let nextTechnologyIndex = gridSlotIds.length;

		const timer = window.setInterval(() => {
			setSlotItems((currentItems) => {
				const nextItems = currentItems.slice();
				nextItems[slotIndex] = technologyMarquee[nextTechnologyIndex];

				slotIndex = (slotIndex + 1) % gridSlotIds.length;
				nextTechnologyIndex =
					(nextTechnologyIndex + 1) % technologyMarquee.length;

				return nextItems;
			});
		}, 2800);

		return () => window.clearInterval(timer);
	}, []);

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{slotItems.map((technology, index) => {
				if (!technology) return null;

				return (
					<div
						key={gridSlotIds[index]}
						className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-white/[0.05]"
					>
						<AnimatePresence mode="wait" initial={false}>
							<motion.div
								key={technology.name}
								initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
								animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
								exit={{ opacity: 0, y: -8, filter: "blur(5px)" }}
								transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
							>
								<div className="flex items-center justify-between gap-4">
									<h3 className="text-lg font-semibold text-white">
										{technology.name}
									</h3>
									<span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
										<SkillIcon
											skillIcon={technology.skillIcon}
											logoUrl={technology.logoUrl}
										/>
									</span>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>
				);
			})}
		</div>
	);
}

export function TechStackSection() {
	return (
		<section id="stack" className="overflow-hidden py-16 sm:py-20">
			<div className="page-wrap">
				<Reveal>
					<SectionHeading
						eyebrow="Tech Stack"
						title="Tecnologias que uso durante o desenvolvimento de aplicações."
						description="Essas são algumas das tecnologias que utilizo no meu dia a dia para desenvolver aplicações web e mobile, garantindo qualidade, performance e escalabilidade."
					/>
				</Reveal>
			</div>

			<Reveal delay={0.05} className="mt-10">
				<TechnologyMarquee />
			</Reveal>

			<div className="page-wrap mt-10">
				<Reveal delay={0.12}>
					<TechnologyGrid />
				</Reveal>
			</div>
		</section>
	);
}
