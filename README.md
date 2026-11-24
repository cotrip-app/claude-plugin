# CoTrip plugins

Two versions of the [CoTrip](https://cotrip.wlln.dev) plugin, one for each store, each following that store's rules:

| | Claude | OpenAI (ChatGPT and Codex) |
|---|---|---|
| Folder | [`claude/`](claude/) | [`openai/`](openai/) |
| Manifest | `claude/.claude-plugin/plugin.json` | `openai/plugin.json` (portable format, directory listing in `extensions.com.openai`) |
| MCP server | `claude/.mcp.json` | `openai/mcp.json` (`streamable-http`, OAuth with dynamic client registration) |
| Agent | `claude/agents/trip-planner.md` | not available there |
| Skills | `claude/skills/` | `openai/skills/` (no mention of purchases, plans or credits, which OpenAI forbids) |
| Icon | `claude/.claude-plugin/icon.png` (512 px; only counts on the listing's first save) | the app icon, downloaded from the site when packing |
| Package | `dist/cotrip.plugin` | `dist/cotrip-openai.zip` |
| Publishing | this repository's marketplace (`.claude-plugin/marketplace.json` points to `./claude`) and the Claude directory | zip uploaded to OpenAI's plugin portal |

Install in Claude Code:

```
/plugin marketplace add cotrip-app/claude-plugin
/plugin install cotrip@cotrip
```

Details and examples in [`claude/README.md`](claude/README.md).

Everything in the plugins is written in English. The skills tell the assistant to answer in the person's language and to save trip content in that language.

## Repository rules

- The versions are independent: each folder has its own version number and the skills may diverge. When you change a rule that applies to both, change it in both folders.
- The `claude/` folder only holds the files the plugin uses (manifest, `.mcp.json`, agent, skills, README) and the icon at `.claude-plugin/icon.png`, which the directory recognizes. Scripts or other binaries there hold up the review (`LOCAL_CODE_NOT_CHECKED`, `UNREAD_ASSET_REFERENCED`).
- No other images in the repository. The OpenAI icon comes from the site at pack time.
- In the OpenAI skills, nothing about selling, plans, credits or purchase links.

## Publishing a version

1. Bump `version` in the manifest of the version that changed (`claude/.claude-plugin/plugin.json` or `openai/plugin.json`).
2. Check with `claude plugin validate ./claude` and `node scripts/pack-plugin.mjs` (or `... claude` / `... openai`; the OpenAI one needs internet to download the icon).
3. Merge into `main`. The workflow creates the release: `v<version>` with `cotrip.plugin` for Claude, `openai-v<version>` with `cotrip-openai.zip` for OpenAI (that one isn't marked "latest", so Claude's download link stays right).
4. Claude: in the directory portal, "Submit latest version". OpenAI: upload the new `cotrip-openai.zip` in the portal. Changes only to the MCP server don't need a new package.

When the MCP server tools change in CoTrip, review the skills in both folders (they cite the tools' names and rules) and the test cases in `openai/plugin.json` (`extensions.com.openai.review`).
