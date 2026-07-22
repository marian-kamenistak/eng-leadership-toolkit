/**
 * Developer value calculator — same logic as the live tool at
 * https://www.marian.coach/developer-salary-calculator/
 * Scores a developer across 5 pillars (15 sub-skills), returns level + 2026
 * Western-Europe gross salary estimate.
 */

export type Level = "junior" | "mid" | "senior" | "staff";

export const ROLES = [
	"frontend",
	"backend",
	"product-engineer",
	"data",
	"devops",
	"ai-developer",
] as const;

export const PILLARS = [
	{
		cat: "craft",
		label: "Core craft",
		skills: ["discipline-mastery", "code-quality", "debugging"],
	},
	{
		cat: "systems",
		label: "Systems & judgment",
		skills: ["system-design", "tech-decisions", "data-performance"],
	},
	{
		cat: "impact",
		label: "Impact & ownership",
		skills: ["shipping-outcomes", "production-ownership", "domain-expertise"],
	},
	{
		cat: "influence",
		label: "Collaboration & influence",
		skills: ["communication", "mentoring", "cross-functional"],
	},
	{
		cat: "ai",
		label: "AI leverage",
		skills: ["ai-output", "ai-quality", "ai-workflows"],
	},
] as const;

export type PillarCat = (typeof PILLARS)[number]["cat"];

// Level-aware pillar weights (each level column sums to 100)
export const PILLAR_WEIGHTS: Record<Level, Record<PillarCat, number>> = {
	junior: { craft: 45, systems: 10, impact: 15, influence: 10, ai: 20 },
	mid: { craft: 35, systems: 18, impact: 22, influence: 13, ai: 12 },
	senior: { craft: 25, systems: 25, impact: 25, influence: 15, ai: 10 },
	staff: { craft: 15, systems: 25, impact: 30, influence: 20, ai: 10 },
};

// Baseline prefill applied to any skill the caller does not score
export const LEVEL_BASELINE: Record<Level, number> = {
	junior: 3,
	mid: 5,
	senior: 6,
	staff: 7,
};

export function getLevelLabel(score: number): string {
	if (score <= 3.0) return "Junior Developer";
	if (score <= 5.5) return "Mid-Level Developer";
	if (score <= 7.5) return "Senior Developer";
	return "Staff Developer";
}

// Gross EUR/year, Western Europe (Germany/Netherlands hubs), 2026
export function estimateSalary(score: number): number {
	const breakpoints = [
		{ score: 0, salary: 45000 },
		{ score: 3, salary: 62000 },
		{ score: 5.5, salary: 85000 },
		{ score: 7.5, salary: 120000 },
		{ score: 10, salary: 160000 },
	];
	if (score <= 0) return breakpoints[0].salary;
	if (score >= 10) return breakpoints[4].salary;
	for (let i = 1; i < breakpoints.length; i++) {
		if (score <= breakpoints[i].score) {
			const prev = breakpoints[i - 1];
			const curr = breakpoints[i];
			const t = (score - prev.score) / (curr.score - prev.score);
			return Math.round((prev.salary + t * (curr.salary - prev.salary)) / 1000) * 1000;
		}
	}
	return breakpoints[4].salary;
}

export interface AssessmentResult {
	totalScore: number;
	levelLabel: string;
	salaryEur: number;
	pillarScores: Record<PillarCat, number>;
}

export function assess(
	level: Level,
	skillScores: Partial<Record<string, number>>,
): AssessmentResult {
	const baseline = LEVEL_BASELINE[level];
	const pillarScores = {} as Record<PillarCat, number>;
	for (const p of PILLARS) {
		let sum = 0;
		for (const s of p.skills) {
			const v = skillScores[s];
			sum += typeof v === "number" ? Math.max(0, Math.min(10, v)) : baseline;
		}
		pillarScores[p.cat] = Math.round((sum / p.skills.length) * 10) / 10;
	}
	const w = PILLAR_WEIGHTS[level];
	let totalScore = 0;
	for (const p of PILLARS) {
		totalScore += (w[p.cat] / 100) * pillarScores[p.cat];
	}
	totalScore = Math.round(totalScore * 10) / 10;
	return {
		totalScore,
		levelLabel: getLevelLabel(totalScore),
		salaryEur: estimateSalary(totalScore),
		pillarScores,
	};
}
