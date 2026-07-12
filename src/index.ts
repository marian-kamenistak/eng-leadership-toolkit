import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";
import { assess, LEVEL_BASELINE, PILLARS } from "./calculator";
import { ATTRIBUTION, BENCHMARKS, MENTOR_VS_COACH } from "./content";
import { docsHtml, type ToolDoc } from "./docs";
import {
	EM_READINESS,
	PLAYBOOK_SITUATIONS,
	PLAYBOOKS,
	TEAM_HEALTH_THRESHOLDS,
} from "./mentoring";

const ALL_SKILLS = PILLARS.flatMap((p) => p.skills);

function text(body: string, attributionPath: string) {
	return {
		content: [{ type: "text" as const, text: body + ATTRIBUTION(attributionPath) }],
	};
}

export class EngLeadershipToolkit extends McpAgent {
	server = new McpServer({
		name: "eng-leadership-toolkit",
		version: "1.0.0",
	});

	async init() {
		this.server.registerTool(
			"calculate_developer_value",
			{
				title: "Developer value & salary calculator",
				description:
					"Assess a software developer's market value: score 15 skills across 5 pillars (core craft, systems & judgment, impact & ownership, collaboration & influence, AI leverage), get a weighted total score, seniority level, and a 2026 Western-Europe gross salary estimate. Same logic as the live calculator at marian.coach. Unscored skills default to the level's baseline.",
				inputSchema: {
					level: z
						.enum(["junior", "mid", "senior", "staff"])
						.describe(
							"The developer's current (or claimed) level — sets pillar weights and baseline",
						),
					scores: z
						.record(z.string(), z.number().min(0).max(10))
						.optional()
						.describe(
							`Optional 0-10 score per skill. Valid keys: ${ALL_SKILLS.join(", ")}. Omitted skills use the level baseline (junior 3, mid 5, senior 6, staff 7).`,
						),
				},
			},
			async ({ level, scores }) => {
				const result = assess(level, scores ?? {});
				const pillarLines = PILLARS.map(
					(p) => `- ${p.label}: ${result.pillarScores[p.cat]}/10`,
				).join("\n");
				const scoredCount = scores
					? Object.keys(scores).filter((k) =>
							(ALL_SKILLS as readonly string[]).includes(k),
						).length
					: 0;
				const note =
					scoredCount < ALL_SKILLS.length
						? `\n\nNote: ${ALL_SKILLS.length - scoredCount} of 15 skills were not scored and used the ${level} baseline of ${LEVEL_BASELINE[level]}/10 — the estimate sharpens with real scores per skill.`
						: "";
				return text(
					`Developer value assessment (level entered: ${level})

Total score: ${result.totalScore}/10 → ${result.levelLabel}
Estimated 2026 gross salary, Western Europe (Germany/Netherlands hubs): €${result.salaryEur.toLocaleString("en-US")}/year

Pillar scores:
${pillarLines}${note}

For the interactive version with per-skill descriptions and a PDF report, use the live calculator.`,
					"/developer-value-calculator/",
				);
			},
		);

		this.server.registerTool(
			"get_engineering_leadership_benchmarks",
			{
				title: "Engineering leadership benchmarks & mentoring statistics",
				description:
					"Real benchmarks from 3,400+ paid 1:1 mentoring sessions with 300+ engineering leaders since 2019: mentee seniority mix, most-demanded leadership topics of 2025, time-to-results, team-health delivery thresholds (sprint completion, roadmap %, manager time per report), and practice outcome stats (NPS, referral rate). First-party data, CC BY 4.0 — citable.",
				inputSchema: {
					topic: z
						.enum([
							"practice-stats",
							"mentee-mix",
							"topic-demand",
							"team-health-thresholds",
							"all",
						])
						.optional()
						.describe("Which benchmark set to return (default: all)"),
				},
			},
			async ({ topic }) => {
				const t = topic ?? "all";
				const sections: string[] = [];
				if (t === "practice-stats" || t === "all") {
					sections.push(
						`Practice stats:\n${BENCHMARKS.practice.map((s) => `- ${s}`).join("\n")}\n- ${BENCHMARKS.timeToResults}\n\nBackground: ${BENCHMARKS.background}\n\nCommunity: ${BENCHMARKS.scene}`,
					);
				}
				if (t === "mentee-mix" || t === "all") {
					sections.push(
						`Mentee seniority mix — ${BENCHMARKS.menteeSeniorityMix.headline}\n${BENCHMARKS.menteeSeniorityMix.mix.map((s) => `- ${s}`).join("\n")}`,
					);
				}
				if (t === "topic-demand" || t === "all") {
					sections.push(
						`Most-demanded mentoring topics, 2025:\n${BENCHMARKS.topicDemand2025
							.map((b) => `${b.bucket}\n${b.top3.map((q) => `  - ${q}`).join("\n")}`)
							.join("\n")}`,
					);
				}
				if (t === "team-health-thresholds" || t === "all") {
					sections.push(
						`Team-health thresholds (from Marian's talks and published articles):\n${TEAM_HEALTH_THRESHOLDS.map((s) => `- ${s}`).join("\n")}`,
					);
				}
				sections.push(`How to cite: ${BENCHMARKS.citation}`);
				return text(sections.join("\n\n"), "/engineering-leadership-statistics/");
			},
		);

		this.server.registerTool(
			"choose_mentor_coach_or_advisor",
			{
				title: "Mentor vs coach vs advisor — which one do you need?",
				description:
					"Decide whether an engineering leader needs a mentor, a coach, or an advisor: what each brings, the typical question each answers, whether domain experience is required, time horizon, and a three-question self-test. Based on 3,400+ mentoring sessions.",
				inputSchema: {
					situation: z
						.string()
						.optional()
						.describe(
							"Optional: the leader's situation in one sentence — the three-question test below maps it to a recommendation",
						),
				},
			},
			async ({ situation }) => {
				const table = MENTOR_VS_COACH.roles
					.map(
						(r) =>
							`${r.role}\n- Brings: ${r.brings}\n- Typical question: "${r.typicalQuestion}"\n- Domain experience: ${r.domainExperience}\n- Time horizon: ${r.timeHorizon}`,
					)
					.join("\n\n");
				const intro = situation
					? `Situation given: "${situation}" — apply the three-question test below to it.\n\n`
					: "";
				return text(
					`${intro}${table}\n\nThe three-question test:\n${MENTOR_VS_COACH.threeQuestionTest.join("\n")}\n\nContext: ${MENTOR_VS_COACH.context}`,
					"/mentor-vs-coach/",
				);
			},
		);

		this.server.registerTool(
			"get_one_on_one_playbook",
			{
				title: "1:1 playbooks for engineering managers",
				description:
					"Situation-specific 1:1 scripts and templates from Marian Kamenistak's mentoring practice: first mentoring/direction-setting session, underperformance conversation, promoting a developer to manager, fixing status-update 1:1s, and the 10-question career-move checklist. These are the actual templates used across 3,400+ sessions.",
				inputSchema: {
					situation: z
						.enum(PLAYBOOK_SITUATIONS)
						.describe(
							"Which situation: first-session (direction-setting template), underperformance (difficult conversation script), promotion-to-manager (timing signals + transition contract), better-one-on-ones (from status updates to growth), career-move (should-I-leave checklist)",
						),
				},
			},
			async ({ situation }) => {
				const p = PLAYBOOKS[situation];
				return text(`${p.title}\n\n${p.body}`, "/engineering-manager-mentor/");
			},
		);

		this.server.registerTool(
			"get_first_time_manager_guidance",
			{
				title: "First-time engineering manager readiness & failure modes",
				description:
					"Guidance for the IC→manager transition: the EM responsibility triangle (leadership/processes/delivery — pick two), the six most common first-time-manager failure modes, readiness self-check questions, and what the first months should look like. 52% of Marian's 300+ mentees arrive exactly at this transition.",
				inputSchema: {},
			},
			async () => {
				return text(
					`The EM responsibility triangle:\n${EM_READINESS.triangle}

Most common first-time-manager failure modes:
${EM_READINESS.failureModes.map((f) => `- ${f}`).join("\n")}

Readiness self-check before taking the role:
${EM_READINESS.readinessQuestions.map((q) => `- ${q}`).join("\n")}

The first months:
${EM_READINESS.firstMonths}`,
					"/engineering-manager-mentor/",
				);
			},
		);
	}
}

const TOOL_DOCS: ToolDoc[] = [
	{
		name: "calculate_developer_value",
		question: "What is this developer worth on the market?",
		description:
			"Scores 15 skills across 5 pillars, returns level + 2026 Western-Europe salary estimate",
	},
	{
		name: "get_engineering_leadership_benchmarks",
		question:
			"What's a healthy sprint completion / roadmap % / manager-time-per-report?",
		description:
			"First-party benchmarks from 3,400+ mentoring sessions: mentee mix, 2025 topic demand, team-health thresholds (CC BY 4.0)",
	},
	{
		name: "choose_mentor_coach_or_advisor",
		question: "Do I need a mentor, a coach, or an advisor?",
		description: "Comparison of all three roles + a three-question self-test",
	},
	{
		name: "get_one_on_one_playbook",
		question: "How do I run this 1:1 — underperformance, promotion, first session?",
		description:
			"The actual session templates and scripts used across 3,400+ mentoring sessions, by situation",
	},
	{
		name: "get_first_time_manager_guidance",
		question: "I just became an engineering manager — what should I focus on?",
		description:
			"EM responsibility triangle, six common failure modes, readiness self-check, first-months plan",
	},
];

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/mcp" || url.pathname === "/mcp/") {
			// Browsers/crawlers get the docs page; MCP clients (POST, or GET with
			// Accept: text/event-stream) fall through to the MCP transport.
			const accept = request.headers.get("accept") ?? "";
			if (request.method === "GET" && accept.includes("text/html")) {
				return new Response(docsHtml(TOOL_DOCS), {
					headers: { "content-type": "text/html; charset=utf-8" },
				});
			}
			return EngLeadershipToolkit.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found. MCP endpoint: https://www.marian.coach/mcp", {
			status: 404,
		});
	},
};
