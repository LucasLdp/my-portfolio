import type { IconType } from "react-icons";

export type NavigationItem = {
	label: string;
	href: string;
};

export type SocialLink = {
	label: string;
	href: string;
	icon: IconType;
};

export type ExperienceItem = {
	role: string;
	company: string;
	period: string;
	technologies: string[];
	description: string;
};

export type TechnologyItem = {
	name: string;
	skillIcon: string;
	logoUrl?: string;
	description: string;
};

export type ProjectItem = {
	title: string;
	description: string;
	technologies: string[];
	githubUrl: string;
	demoUrl: string;
};
