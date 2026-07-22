/**
 * Engineering manager value calculator — same logic as the live tool at
 * https://www.marian.coach/engineering-manager-salary-calculator/
 * Scores a leader across 5 pillars (15 sub-skills), weighted by their
 * current level, returns level + 2026 Western-Europe gross salary estimate.
 */

export type EmLevel = "team-lead" | "em" | "senior-em" | "director";

export const EM_LEVELS = ["team-lead", "em", "senior-em", "director"] as const;

// Track only sets the context framing on the live page; scoring is
// weighted by level, identically across tracks.
export const EM_TRACKS = [
	"product-teams",
	"platform-infra",
	"data-ml",
	"agency",
	"startup",
	"scaleup",
] as const;

export type EmTrack = (typeof EM_TRACKS)[number];

export const EM_TRACK_LABELS: Record<EmTrack, string> = {
	"product-teams": "Product Teams",
	"platform-infra": "Platform / Infra",
	"data-ml": "Data / ML",
	agency: "Agency / Consultancy",
	startup: "Startup (seed-A)",
	scaleup: "Scaleup / Enterprise",
};

export const EM_PILLARS = [
	{
		cat: "people",
		label: "People & talent",
		skills: ["hiring", "coaching", "performance"],
	},
	{
		cat: "delivery",
		label: "Delivery & execution",
		skills: ["predictable-delivery", "quality-ops", "process-fit"],
	},
	{
		cat: "tech",
		label: "Technical direction",
		skills: ["architecture-judgment", "tech-strategy", "build-vs-buy"],
	},
	{
		cat: "influence",
		label: "Stakeholder influence",
		skills: ["product-partnership", "managing-upward", "org-influence"],
	},
	{
		cat: "ai",
		label: "AI leverage",
		skills: ["ai-team-workflows", "ai-product", "ai-impact"],
	},
] as const;

export type EmPillarCat = (typeof EM_PILLARS)[number]["cat"];

// Level-aware pillar weights (each level column sums to 100)
export const EM_PILLAR_WEIGHTS: Record<EmLevel, Record<EmPillarCat, number>> = {
	"team-lead": { people: 30, delivery: 30, tech: 20, influence: 10, ai: 10 },
	em: { people: 30, delivery: 25, tech: 15, influence: 20, ai: 10 },
	"senior-em": { people: 25, delivery: 20, tech: 15, influence: 30, ai: 10 },
	director: { people: 20, delivery: 15, tech: 15, influence: 35, ai: 15 },
};

// Baseline prefill applied to any skill the caller does not score
export const EM_LEVEL_BASELINE: Record<EmLevel, number> = {
	"team-lead": 3,
	em: 5,
	"senior-em": 6,
	director: 7,
};

export function getEmLevelLabel(score: number): string {
	if (score <= 3.0) return "Team Lead";
	if (score <= 5.5) return "Engineering Manager";
	if (score <= 7.5) return "Senior EM / Group Lead";
	return "Director / VP of Engineering";
}

// Gross EUR/year, Western Europe (Germany/Netherlands hubs), 2026.
// Anchored to 2026 market data: Team Lead ~70-95K, EM ~85-120K,
// Senior EM/Group Lead ~100-140K, Director/VP ~130-190K.
export function estimateEmSalary(score: number): number {
	const breakpoints = [
		{ score: 0, salary: 70000 },
		{ score: 3, salary: 90000 },
		{ score: 5.5, salary: 110000 },
		{ score: 7.5, salary: 135000 },
		{ score: 10, salary: 190000 },
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

export interface EmAssessmentResult {
	totalScore: number;
	levelLabel: string;
	salaryEur: number;
	pillarScores: Record<EmPillarCat, number>;
}

export function assessEm(
	level: EmLevel,
	skillScores: Partial<Record<string, number>>,
): EmAssessmentResult {
	const baseline = EM_LEVEL_BASELINE[level];
	const pillarScores = {} as Record<EmPillarCat, number>;
	for (const p of EM_PILLARS) {
		let sum = 0;
		for (const s of p.skills) {
			const v = skillScores[s];
			sum += typeof v === "number" ? Math.max(0, Math.min(10, v)) : baseline;
		}
		pillarScores[p.cat] = Math.round((sum / p.skills.length) * 10) / 10;
	}
	const w = EM_PILLAR_WEIGHTS[level];
	let totalScore = 0;
	for (const p of EM_PILLARS) {
		totalScore += (w[p.cat] / 100) * pillarScores[p.cat];
	}
	totalScore = Math.round(totalScore * 10) / 10;
	return {
		totalScore,
		levelLabel: getEmLevelLabel(totalScore),
		salaryEur: estimateEmSalary(totalScore),
		pillarScores,
	};
}
