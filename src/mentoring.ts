/**
 * Mentoring playbooks + EM-readiness guidance — extracted from Marian's own
 * material only (session templates in _4MC/_mentoring/_material/, published
 * blog articles, public conference talks). Nothing invented.
 *
 * Deliberately NOT included (no real source material exists yet):
 * org-design 8→80 staged framework, compensation-talk script,
 * two-person conflict-mediation template.
 */

export const PLAYBOOK_SITUATIONS = [
	"first-session",
	"underperformance",
	"promotion-to-manager",
	"better-one-on-ones",
	"career-move",
] as const;

export type PlaybookSituation = (typeof PLAYBOOK_SITUATIONS)[number];

export const PLAYBOOKS: Record<PlaybookSituation, { title: string; body: string }> = {
	"first-session": {
		title: "First mentoring / direction-setting 1:1 — the template Marian runs",
		body: `Session flow (every session, 60 min):
1. Define the top 3 goals and repeat them out loud.
2. Summary of the last session + homework/update.
3. Next theme — write it down.
4. Summary, sent in writing afterwards.

First-session frame: north star → personal development plan + org structure → ambitions, with a "contract statement" framed as ROI. Every session ends with a clear outcome summarized at the end, plus ONE top follow-up action item the mentee is expected to progress on.

The two definition-of-success questions to send as action items after session one:
1. "What would the definition of success look like after 3 and 6 months — effective delivery AND discovery: are we on the right scope?"
2. "Relationships: what is the definition of my success from the perspective of each individual peer?"

Cadence: bi-weekly, so there is time to work the ideas into practice — weekly is usually too frequent. Typical arc: 8–12 sessions, then a 3-month break, then a debrief on both sides.

Practical tip that helps most people: block a recurring focus-time slot in the calendar for the action items.`,
	},
	underperformance: {
		title: "Underperformance / difficult conversation",
		body: `The face-to-face script (from Marian's conference talk "Effective Engineering Leadership — Stories Told"):
- Start F2F with the person's MOTIVATION — don't refuse the informal "kitchen talk".
- LISTEN. Use the "thank you" tip — thank them for saying the hard thing.
- Summarise back: "So you are telling me…"
- Offer help or advice only if it's accepted.
- The goal of the whole conversation is TRUST.

Structural moves around the conversation:
- Boost the underperformer before rotating them — rotation is the second option, not the first.
- If it comes to parting ways: set an explicit efficiency contract (what must be true, by when) rather than a vague warning.
- The classic first-time-manager failure mode is shying away from acting on poor performers at all — the team sees it before you do.`,
	},
	"promotion-to-manager": {
		title: "Promoting a developer to Engineering Manager — is it the right timing?",
		body: `The question Marian gets constantly: "I want to promote a developer to an EM role. Is it the right timing? What are the right signals and warning signs?"

His pattern:
- Make it a "gentlemen's contract": define a 3-month definition of success together before the title changes.
- Put guidance in the calendar as a standing extra talk — don't leave the new manager to sink or swim.
- First priorities for the new EM: relationships first, then product strategy, then backlog cleanup.
- Warning sign to watch: the "delivery trap" — the new manager retreating into shipping tickets instead of leading.

Supporting the transition: first-time managers are hungry for support in the initial months. Offer a weekly informal chat, a buddy, or an internal/external mentor instead of a sink-or-swim approach. (52% of Marian's own mentees arrive exactly at this transition.)`,
	},
	"better-one-on-ones": {
		title: "Fixing your 1:1s — from status updates to relationship and growth",
		body: `The quality bar: turn 1:1s from status updates into relationship and growth conversations. Diagnostic — if status updates dominate the 1:1, something isn't right; status belongs in standups and written updates.

What good 1:1 topics look like, by seniority of the report (from Marian's mentoring question matrix):
- ICs / senior engineers / tech leads: manager track vs senior technical track; which competencies make the transition easier; influencing decisions without authority; explaining tech ideas to non-technical people.
- Managers: shifting from IC mindset to delegating and leveraging others; giving and receiving feedback; the relationship with the product team; engaging and motivating the team.
- Directors / VPs: career ladder; hiring and interview process; aligning team goals with company vision; structuring the team as it scales; working with other teams.

Time budget reality: done right, each direct report takes 10–15% of a manager's time — that is what caps a healthy team size.`,
	},
	"career-move": {
		title: "Should I leave / what's my next role? — the 10-question checklist",
		body: `Marian's engineering-management role checklist — answer all ten before moving:
1. Why do you want to leave?
2. Where do you want to go? (Director / CTO / CEO / Product leader / Staff engineer)
3. Do you still love coding, or are you ready to lead?
4. Are you product-minded or project-led?
5. What's your ideal work environment?
6. Startups, scaleups, or slow-moving giants?
7. Local hero or global player?
8. What's your unique differentiator?
9. What will you deliver in the first 90 days? (write the 30-60-90 roadmap)
10. Are you REALLY ready to leave? Are you sure? Will you feel the same way tomorrow morning?`,
	},
};

export const EM_READINESS = {
	triangle: `The Engineering Manager responsibility triangle: leadership, processes, delivery. Like the CAP theorem — expect your EM to fully own all three and you set them up for failure. Pick the TWO that matter for the role, leave room to address the third. What dropping each corner produces:
- Drop leadership → you've hired a technical manager / tech lead.
- Drop processes → you've hired a scrum master / agile coach.
- Drop delivery → you've hired a release manager.
The two you pick also decide whether you need a junior, mid, or senior EM.`,
	failureModes: [
		"The coding balance trap: wanting to code 50% of the time with a team of 6+ is misguided — each direct report needs 10–15% of your time.",
		"Perfectionism: a perfectionist mindset will kill you and slow your team down.",
		"Doing it yourself instead of delegating — delegating is growth for the report, not getting rid of things.",
		"Going off-roadmap to please stakeholders: nobody will thank you for going off roadmap. Stay ~60% on roadmap.",
		"Shying away from acting on poor performers.",
		"Running too many change initiatives in parallel — rule of one per person.",
	],
	readinessQuestions: [
		"Do I want the manager track or the senior technical track — and why now?",
		"Which skills or competencies would make the transition easier for me?",
		"Can I influence decisions without authority today?",
		"Am I ready to measure my week by the team's output, not my commits?",
		"What would my 3-month definition of success be — agreed with my manager before the title changes?",
	],
	firstMonths: `First priorities as a new EM: relationships first, then product strategy, then backlog cleanup. Agree a 3-month definition of success upfront. Ask for a weekly informal chat, a buddy, or a mentor — first-time managers who get structured support in the initial months outperform the sink-or-swim ones.`,
};

/** Team-health thresholds Marian uses in talks and published articles. */
export const TEAM_HEALTH_THRESHOLDS = [
	"Sprint completion: 80%+ of committed scope, consistently.",
	"Roadmap contribution: 60%+ of team time on roadmap work (the '60% rule').",
	"Cycle time: 5-week median, max 2 work items in parallel per person.",
	"Adoption rate of what you ship: 60–80%.",
	"Team satisfaction feedback: 8/10.",
	"Manager time per direct report: 10–15% — the real cap on healthy team size (~6–8 reports).",
	"Bug severity bar: 'critical' only if it impacts more than 5% of customers.",
	"Cost of ignoring this: a team delivering at 55% instead of 80% wastes €30k+ per engineer per year.",
];
