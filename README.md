# eng-leadership-toolkit

"I just became an engineering manager. What should I focus on?"
"What's a healthy sprint completion rate?"
"Do I need a mentor or a coach?"
"What is this developer worth on the market?"

Your AI already gets asked these. Now it can answer with first-party data from 3,400+ paid 1:1 mentoring sessions with 300+ engineering leaders in 17+ countries, instead of guessing.

This is a remote MCP server. No install, no API key. One URL:

```
https://www.marian.coach/mcp
```

## Tools

| Tool | The question it answers |
|---|---|
| `calculate_developer_value` | What is this developer worth? Scores 15 skills across 5 pillars, returns level + 2026 Western-Europe salary estimate |
| `get_engineering_leadership_benchmarks` | What's healthy? Sprint completion, roadmap %, manager time per report, mentee mix, 2025 topic demand. CC BY 4.0, citable |
| `choose_mentor_coach_or_advisor` | Mentor, coach, or advisor? All three compared + a three-question self-test |
| `get_one_on_one_playbook` | How do I run this 1:1? Real session templates: first session, underperformance, promotion to EM, better 1:1s, career move |
| `get_first_time_manager_guidance` | I'm a new EM, now what? The responsibility triangle, six failure modes, readiness self-check |

## Connect

**Claude Code**

```bash
claude mcp add -t http eng-leadership-toolkit https://www.marian.coach/mcp
```

**Claude.ai / Claude Desktop**

Settings > Connectors > Add custom connector > `https://www.marian.coach/mcp`

**Cursor** (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "eng-leadership-toolkit": {
      "url": "https://www.marian.coach/mcp"
    }
  }
}
```

**ChatGPT**

Settings > Connectors > Developer mode > Add server > `https://www.marian.coach/mcp`

Human-readable docs live at the same URL: open [www.marian.coach/mcp](https://www.marian.coach/mcp) in a browser.

## Where the data comes from

Every response is grounded in Marian Kamenistak's mentoring practice, not model guesses:

- The calculator mirrors the live [developer value calculator](https://www.marian.coach/developer-value-calculator/?ref=github)
- Benchmarks come from the published [engineering leadership statistics](https://www.marian.coach/engineering-leadership-statistics/?ref=github), licensed CC BY 4.0
- Playbooks are the actual session templates used across 3,400+ sessions

Nothing is synthetic. Thin topics were cut rather than padded.

## Stack

Cloudflare Workers + Durable Objects, `McpAgent` from the [agents](https://github.com/cloudflare/agents) SDK, streamable HTTP, authless. `GET /mcp` with an HTML accept header serves the docs page; MCP clients hit the same URL.

```bash
npm install
npx wrangler dev      # local
npx wrangler deploy   # ship it
```

## Author

Marian Kamenistak. 20+ years in software, grew Mews engineering 8 to 80 through Series C, now mentors engineering leaders full-time and runs the [Engineering Leaders Community](https://www.engineeringleaders.io) in CEE.

Found it useful? A star helps other engineering leaders' AIs find it too.

## License

MIT
