import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";

import type {
	ExperienceItem,
	ProjectItem,
	SocialLink,
} from "#/types/portfolio";
import { siteConfig } from "./site";

export const profileHighlights = [
	"Desenvolvimento fullstack com atenção ao contexto, ao detalhe e à manutenção do dia seguinte.",
	"Experiência com aplicações web, painéis internos e fluxos que apoiam a operação de equipes.",
	"Gosto de trabalhar perto de produto, design e das pessoas que vão usar o que construímos.",
];

export const socialLinks: SocialLink[] = [
	{ label: "GitHub", href: siteConfig.github, icon: SiGithub },
	{ label: "LinkedIn", href: siteConfig.linkedin, icon: FaLinkedinIn },
];

export const contactLinks: SocialLink[] = [
	{ label: "GitHub", href: siteConfig.github, icon: SiGithub },
	{ label: "LinkedIn", href: siteConfig.linkedin, icon: FaLinkedinIn },
];

export const experienceItems: ExperienceItem[] = [
	{
		role: "Estagiário de desenvolvimento",
		company: "Ux Software",
		period: "08/2024 - 12/2025",
		technologies: [
			"React",
			"NextJS",
			"TypeScript",
			"Tailwind CSS",
			"Node.js",
			"PostgreSQL",
			"NestJS",
		],
		description:
			"Desenvolvi aplicações web e mobile com React Native, Next.js, Node.js e NestJS, com impacto em mais de 10 mil usuários de 20+ provedoras de internet. Também otimizei interfaces, corrigi bugs e participei de code reviews e planejamentos, com foco em estabilidade e experiência de uso.",
	},
	{
		role: "Desenvolvedor Web",
		company: "Karnaúba Soft",
		period: "01/2025 - 12/2025",
		technologies: [
			"Next.js",
			"TypeScript",
			"NestJS",
			"Tailwind CSS",
			"Node.js",
			"PostgreSQL",
		],
		description:
			"Desenvolvi funcionalidades e integrações para um sistema administrativo de gestão do trânsito municipal. Também otimizei consultas, analisei demandas e corrigi inconsistências, contribuindo para automatizar processos internos e melhorar as rotinas de atendimento.",
	},
	{
		role: "Desenvolvedor Back-end",
		company: "Startup Devmax",
		period: "03/2023 - 12/2023",
		technologies: [
			"Node.js",
			"APIs",
			"Express",
			"Automação",
			"MySQL",
			"HTML",
			"CSS",
			"JavaScript",
		],
		description:
			"Desenvolvi e mantive um painel administrativo para um órgão de saúde municipal. Integrei sistemas internos, otimizei consultas, implementei funcionalidades e participei do planejamento técnico e da correção de problemas para apoiar os fluxos da equipe.",
	},
];

export const githubSkills = [
	{ name: "JavaScript", icon: "js" },
	{ name: "HTML", icon: "html" },
	{ name: "CSS", icon: "css" },
	{ name: "React", icon: "react" },
	{ name: "Next.js", icon: "nextjs" },
	{ name: "TypeScript", icon: "ts" },
	{ name: "Tailwind CSS", icon: "tailwind" },
	{ name: "Docker", icon: "docker" },
	{ name: "Git", icon: "git" },
	{ name: "Vue", icon: "vue" },
	{ name: "Node.js", icon: "nodejs" },
	{ name: "MySQL", icon: "mysql" },
	{ name: "PostgreSQL", icon: "postgres" },
	{ name: "AdonisJS", icon: "adonis" },
	{ name: "NestJS", icon: "nest" },
	{ name: "Express", icon: "express" },
	{ name: "Python", icon: "py" },
	{ name: "Django", icon: "django" },
] as const;

export const projectItems: ProjectItem[] = [
	{
		title: "Central de operações",
		description:
			"Uma área única para acompanhar processos do dia a dia, consultar pendências e dar visibilidade ao que cada equipe precisa resolver.",
		technologies: ["React", "TanStack Query", "Node.js", "PostgreSQL"],
		githubUrl: "https://github.com/",
		demoUrl: "https://example.com/",
	},
	{
		title: "Painel de acompanhamento",
		description:
			"Um painel feito para transformar dados de operação em uma leitura direta: o que mudou, onde olhar e qual conversa precisa acontecer.",
		technologies: ["TanStack Start", "TypeScript", "Tailwind CSS", "Zod"],
		githubUrl: "https://github.com/",
		demoUrl: "https://example.com/",
	},
	{
		title: "Site de lançamento SaaS",
		description:
			"Página de apresentação pensada para explicar um produto sem rodeios, funcionar bem no celular e deixar o próximo passo claro para quem chega.",
		technologies: ["React", "Motion", "SEO", "Acessibilidade"],
		githubUrl: "https://github.com/",
		demoUrl: "https://example.com/",
	},
];
