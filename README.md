# Plugins do CoTrip

Duas versões do plugin do [CoTrip](https://cotrip.wlln.dev), uma para cada loja, cada uma seguindo as regras da sua:

| | Claude | OpenAI (ChatGPT e Codex) |
|---|---|---|
| Pasta | [`claude/`](claude/) | [`openai/`](openai/) |
| Manifesto | `claude/.claude-plugin/plugin.json` | `openai/plugin.json` (formato portátil, ficha do diretório em `extensions.com.openai`) |
| Servidor MCP | `claude/.mcp.json` | `openai/mcp.json` (`streamable-http`, OAuth por registro dinâmico) |
| Agente | `claude/agents/planejador-de-roteiros.md` | não existe lá |
| Skills | `claude/skills/` | `openai/skills/` (sem falar de compras, planos ou créditos, que a OpenAI proíbe) |
| Ícone | `claude/.claude-plugin/icon.png` (512 px; vale só no primeiro save da ficha) | o do app, baixado do site ao empacotar |
| Pacote | `dist/cotrip.plugin` | `dist/cotrip-openai.zip` |
| Publicação | marketplace deste repositório (`.claude-plugin/marketplace.json` aponta para `./claude`) e diretório do Claude | zip enviado no portal de plugins da OpenAI |

Instalar no Claude Code:

```
/plugin marketplace add cotrip-app/claude-plugin
/plugin install cotrip@cotrip
```

Detalhes e exemplos em [`claude/README.md`](claude/README.md).

## Regras do repositório

- As versões são independentes: cada pasta tem o próprio número e as skills podem divergir. Ao mudar uma regra que vale para as duas, mude nas duas pastas.
- Na pasta `claude/` só entram os arquivos que o plugin usa (manifesto, `.mcp.json`, agente, skills, README) e o ícone em `.claude-plugin/icon.png`, que o diretório reconhece. Scripts ou outros binários ali seguram a revisão (`LOCAL_CODE_NOT_CHECKED`, `UNREAD_ASSET_REFERENCED`).
- Nenhuma outra imagem no repositório. O ícone da OpenAI vem do site na hora de empacotar.
- Nas skills da OpenAI, nada de vender, citar planos, créditos ou links de compra.

## Publicar uma versão

1. Suba `version` no manifesto da versão que mudou (`claude/.claude-plugin/plugin.json` ou `openai/plugin.json`).
2. Confira com `claude plugin validate ./claude` e `node scripts/pack-plugin.mjs` (ou `... claude` / `... openai`; a da OpenAI precisa de internet para baixar o ícone).
3. Junte na `main`. O workflow cria a release: `v<versão>` com o `cotrip.plugin` para o Claude, `openai-v<versão>` com o `cotrip-openai.zip` para a OpenAI (essa não vira a "mais recente", para o link de download do Claude continuar certo).
4. Claude: no portal do diretório, "Submit latest version". OpenAI: suba o `cotrip-openai.zip` novo no portal. Mudanças só no servidor MCP não precisam de pacote novo.

Quando as ferramentas do servidor MCP mudarem no CoTrip, revise as skills das duas pastas (elas citam os nomes e as regras das ferramentas) e os casos de teste em `openai/plugin.json` (`extensions.com.openai.review`).
