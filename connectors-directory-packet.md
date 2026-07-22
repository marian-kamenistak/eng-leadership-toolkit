# Claude Connectors Directory — submission packet (eng-leadership-toolkit)

Prepared 2026-07-22. Source docs: claude.com/docs/connectors/building/submission + /review-criteria. Nothing submitted; the portal sits behind Claude.ai org-admin settings, so every click below is yours.

## Blockers and pre-reqs, in order

1. **Plan gate (hard blocker).** The submission portal (`https://claude.ai/admin-settings/directory/submissions/new`) exists only for **Team or Enterprise** Claude organizations, and only **Owners / Primary owners** see it (Enterprise can delegate via a custom role with the "Directory management" permission; Team cannot). If your Claude org is an individual/Pro plan, there is no submit path. Verify which plan the claude.ai account carries before anything else.
2. **Tool annotations (fix before submitting — I can do this).** Checked the live server 2026-07-22: all 9 tools have a `title`, **none have `readOnlyHint`**. Directory requirement: every tool needs `title` plus `readOnlyHint: true` (read-only) or `destructiveHint: true`. All 9 of ours are read-only. The portal's Tools step flags un-annotated tools. One small server change + redeploy fixes it; say the word.
3. **Icon.** The portal asks for an icon upload. marian.coach ships webp favicons only: `/favicon-32x32.webp` and `/favicon-192x192.webp` (no `/favicon.ico`, returns 404). Directories normally want a square PNG; have a PNG export of the 192px mark ready (I can convert the webp if the original isn't in the mc-web repo).
4. **Privacy policy — NOT a blocker.** `https://www.marian.coach/privacy-policy/` is live (200). The strict privacy-policy structure (README section + manifest array) applies to *local* MCPB connectors; for a remote server you just paste the URL in the Listing step. Skim it once to confirm it covers data collection, usage/storage, third-party sharing, retention, and a contact — missing pieces mean rejection.
5. **Test yourself first.** The Test & launch step makes you confirm you ran every tool via MCP Inspector or as a custom connector in Claude. No auth on our server, so this is 10 minutes: Settings > Connectors > Add custom connector > `https://www.marian.coach/mcp`, then invoke each of the 9 tools once.

## Prefilled values (paste as-is)

Portal steps in order. 100-char name cap, 55-char tagline cap, 2,000-char description cap.

**Connection**
- Server URL: `https://www.marian.coach/mcp`
- Transport: streamable HTTP
- Same URL for every user: yes

**Tools** — auto-synced from the server. Nothing to type; just check no tool shows an annotation warning (see blocker 2).

**Listing**
- Server name: `Engineering Leadership Toolkit`
- Tagline (55 max, this is 54): `Salary benchmarks and playbooks for engineering leaders`
- Description (2,000 max; ~640 now, expand if you want):
  > Benchmarks and decision tools for engineering leaders, built from 3,400+ mentoring sessions with 300+ leaders in 17+ countries. Nine tools: developer and engineering-manager market-value calculators with 2026 European salary data, a team-lead readiness assessment, engineering leadership benchmarks, 1:1 playbooks for engineering managers, first-time-manager guidance, a mentor-vs-coach-vs-advisor chooser, a coaching cost estimator, and a mentoring business-case builder. All tools are read-only, no account or authentication needed. By Marian Kamenistak, engineering leadership mentor (marian.coach).
- Categories (pick 1–5 from their list): productivity, plus whatever maps to career/coaching/data
- Documentation URL: `https://www.marian.coach/mcp`
- Privacy policy URL: `https://www.marian.coach/privacy-policy/`
- Support contact: `marian@marian.coach`
- Icon: PNG export of the marian.coach 192px favicon (blocker 3)
- URL slug: `eng-leadership-toolkit` — **permanent once published**

**Use cases**
- Primary: benchmark a developer's or EM's market value; decide "should I become a team lead?"; prep a raise or promotion case; build the business case for mentoring; pick between mentor, coach, and advisor.
- What users need before connecting: nothing. No account, no plan, no setup.
- Reads/writes: reads only.

**Company**
- Company name: Marian Kamenistak (marian.coach)
- Website: `https://www.marian.coach`
- Primary contact: pre-filled from your account; set email to `marian@marian.coach`

**Authentication**
- No authentication.

**Data handling**
- API ownership: our own first-party API (server and site share the marian.coach domain — matches their "domain should match your service" rule).
- Personal health data: no. Sponsored content: no.

**Test & launch**
- Test account: none needed, server is open. Say exactly that, and paste: "Connect to https://www.marian.coach/mcp as a custom connector, no credentials. All 9 tools callable immediately; e.g. run calculate_developer_value with any seniority/country input."
- Confirm you've run every tool (pre-req 5).

**Compliance** — seven acknowledgments (directory guidelines, first-party API, financial transactions, AI media, prompt injection, conversation data, public docs). All seven required. None conflict with this server: no payments, no media generation, docs are public at marian.coach/mcp.

## What you click, in order

1. Log into claude.ai with the org-admin account (Team/Enterprise Owner).
2. Go to `https://claude.ai/admin-settings/directory/submissions/new` (Admin settings > Directory > Submissions > New).
3. Walk the 11 steps above; progress auto-saves in the browser session.
4. Submit. Track status + reviewer feedback at `https://claude.ai/admin-settings/directory/submissions`. Escalations: `mcp-review@anthropic.com`.
5. Expect the automatic path first: policy scan, then listing as a "community connector". Verified review only if Anthropic escalates it; no action on your side.

## Review notes

- Review time varies with queue volume; portal is always open.
- Common rejections that could bite us: missing tool annotations (blocker 2), generic error responses from tools, descriptions that don't match behavior. Our tools return structured results and the descriptions were written from the actual outputs, so annotations are the one real gap.
