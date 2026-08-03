import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";

import type {
	ExperienceItem,
	ProjectItem,
	SocialLink,
	TechnologyItem,
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
			"Atuei no desenvolvimento de aplicações web e mobile com React Native, Next.js, Node.js e NestJS, impactando 10.000+ usuários em mais de 20 provedoras de internet. Otimizei interfaces para melhor performance e usabilidade. Além das entregas técnicas e correções de bugs, colaborei em code reviews e planejamentos para garantir estabilidade e melhorias de UX.",
	},
	{
		role: "Desenvolvedor Web",
		company: "Karnaúba Soft",
		period: "01/2025 - 12/2025",
		technologies: [
			"Next.js",
			"TypeScript",
			"NestJS	",
			"Tailwind CSS",
			"Node.js",
			"PostgreSQL",
		],
		description:
			"Atuei no desenvolvimento e evolução de um sistema administrativo voltado à gestão do trânsito municipal, contribuindo para a organização de dados, automatização de processos internos e melhoria das rotinas de atendimento. Fui responsável pela implementação de funcionalidades, integração entre sistemas, otimização de consultas e ajustes técnicos para aumentar a eficiência da plataforma. Também participei da análise de demandas, correção de inconsistências e melhorias contínuas, garantindo maior estabilidade e confiabilidade ao sistema.",
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
			"Desenvolvi e mantive um painel administrativo para a gestão de um órgão de saúde municipal, com foco na otimização de fluxos operacionais e na melhoria da usabilidade. Fui responsável por integrar sistemas internos, otimizar consultas para dar mais eficiência às rotinas administrativas e aprimorar a experiência do usuário com interfaces mais intuitivas. Além do desenvolvimento de novas funcionalidades, atuei no planejamento técnico e na correção de problemas, garantindo a alta performance e a estabilidade contínua do sistema.",
	},
];

export const technologyMarquee: TechnologyItem[] = [
	{
		name: "AdonisJS",
		skillIcon: "adonis",
		description: "Back-end organizado",
	},
	{
		name: "PostgreSQL",
		skillIcon: "postgres",
		description: "Dados relacionais",
	},
	{
		name: "MySQL",
		skillIcon: "mysql",
		description: "Banco de dados",
	},
	{
		name: "HTML",
		skillIcon: "html",
		description: "Estrutura da web",
	},
	{
		name: "CSS",
		skillIcon: "css",
		description: "Estilo e layout",
	},
	{
		name: "JavaScript",
		skillIcon: "js",
		description: "Lógica no navegador",
	},
	{
		name: "React",
		skillIcon: "react",
		description: "Interfaces componíveis",
	},
	{
		name: "Vue",
		skillIcon: "vue",
		description: "Interface progressiva",
	},
	{
		name: "Svelte",
		skillIcon: "svelte",
		description: "UI sem excesso",
	},
	{
		name: "NestJS",
		skillIcon: "nestjs",
		description: "APIs modulares",
	},
	{
		name: "Django",
		skillIcon: "django",
		description: "Aplicações Python",
	},
	{
		name: "Python",
		skillIcon: "py",
		description: "Automação e dados",
	},
	{
		name: "Node.js",
		skillIcon: "nodejs",
		description: "Serviços e APIs",
	},
	{
		name: "TypeScript",
		skillIcon: "ts",
		description: "Contratos claros",
	},
	{
		name: "Tailwind CSS",
		skillIcon: "tailwind",
		description: "Ritmo visual",
	},
	{
		name: "Git",
		skillIcon: "git",
		description: "Histórico compartilhado",
	},
	{
		name: "Express",
		skillIcon: "express",
		description: "APIs enxutas",
	},
	{
		name: "Prisma",
		skillIcon: "prisma",
		description: "Acesso a dados",
	},
	{
		name: "Docker",
		skillIcon: "docker",
		description: "Ambientes consistentes",
	},
	{
		name: "Next.js",
		skillIcon: "nextjs",
		description: "Aplicações React",
	},
	{
		name: "TanStack",
		skillIcon: "tanstack",
		logoUrl: "https://cdn.simpleicons.org/tanstack/FF4154",
		description: "Dados e rotas",
	},
];

export const technologyGrid: TechnologyItem[] = [
	{
		name: "React",
		skillIcon: "react",
		description:
			"Para organizar interfaces em partes reutilizáveis e fáceis de entender.",
	},
	{
		name: "TypeScript",
		skillIcon: "ts",
		description:
			"Para tornar contratos entre telas, APIs e dados mais explícitos.",
	},
	{
		name: "TanStack",
		skillIcon: "tanstack",
		logoUrl: "https://cdn.simpleicons.org/tanstack/FF4154",
		description:
			"Quando uma aplicação precisa juntar navegação, dados e renderização no servidor.",
	},
	{
		name: "Node.js",
		skillIcon: "nodejs",
		description:
			"Para APIs e tarefas que conectam diferentes partes de um sistema.",
	},
	{
		name: "Tailwind CSS",
		skillIcon: "tailwind",
		description:
			"Para manter ritmo visual sem transformar cada tela em uma exceção.",
	},
	{
		name: "PostgreSQL",
		skillIcon: "postgres",
		description:
			"Para verificar comportamentos importantes antes de publicar uma mudança.",
	},
	{
		name: "NestJS",
		skillIcon: "nestjs",
		description:
			"Para validar o que entra na aplicação antes que vire erro adiante.",
	},
	{
		name: "Docker",
		skillIcon: "docker",
		description: "Para publicar, observar e ajustar o que está em produção.",
	},
];

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
