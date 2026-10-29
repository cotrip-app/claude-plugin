# Plugin do CoTrip para Claude, ChatGPT e Codex

Conecta a sua IA ao [CoTrip](https://cotrip.wlln.dev) e ensina a montar roteiros do jeito que o app funciona.

## O que vem nele

- **Conector CoTrip**: o servidor MCP `https://cotrip.wlln.dev/api/mcp`. Na primeira vez, o Claude abre o CoTrip para você entrar com o e-mail e autorizar. Não tem chave nem configuração.
- **Agente `planejador-de-roteiros`** (só no Claude): monta ou reorganiza a viagem inteira, passando pelas skills abaixo.
- **Skills**:
  - `cotrip`: regras para ler e editar viagens (IDs, ordem do dia, tipos de item, limites).
  - `montar-roteiro`: cria a viagem do zero a partir de uma conversa, lista de lugares ou roteiro colado.
  - `distribuir-locais`: leva os locais aos dias por região, horário, prioridade e ritmo.
  - `adicionar-transportes`: lança um transporte por trecho e encaixa entre os locais.
  - `revisar-dia`: aponta dia corrido, horário errado, ida e volta no mapa, alertas faltando.
  - `preparar-visita`: pesquisa cada local (melhor horário, destaques, cuidados) e grava a visita no CoTrip, no formato padrão ou no que você pedir.

## Instalar

**Claude Code**

```
/plugin marketplace add cotrip-app/claude-plugin
/plugin install cotrip@cotrip
```

Depois rode `/mcp`, escolha `cotrip` e autentique.

**Claude (app e claude.ai)**

Baixe o `cotrip.plugin` da [versão mais recente](https://github.com/cotrip-app/claude-plugin/releases/latest/download/cotrip.plugin) e adicione na área de plugins, ou adicione o marketplace `cotrip-app/claude-plugin`. Se preferir só o conector, adicione `https://cotrip.wlln.dev/api/mcp` como conector personalizado.

**ChatGPT e Codex**

Procure CoTrip no diretório de plugins quando ele estiver publicado. O pacote para o portal da OpenAI é o `cotrip-openai.zip` de cada [versão](https://github.com/cotrip-app/claude-plugin/releases/latest).

## Um plugin, dois formatos

As skills e o servidor MCP são os mesmos. Os arquivos só da OpenAI moram em `openai/` e vão para a raiz do zip:

| | Claude | OpenAI (ChatGPT e Codex) |
|---|---|---|
| Manifesto | `.claude-plugin/plugin.json` | `openai/plugin.json` (formato portátil, textos do diretório em `extensions.com.openai`) |
| Servidor MCP | `.mcp.json` | `openai/mcp.json` (com `type: streamable-http` e OAuth por registro dinâmico) |
| Ícone | definido na ficha do diretório | o do app, baixado do site ao empacotar |
| Agente | `agents/` | não existe lá; fica fora do pacote |
| Pacote | `dist/cotrip.plugin` | `dist/cotrip-openai.zip` |

Um não lê os arquivos do outro, então não há conflito. Não guarde imagens no repositório nem cite uma em arquivo: o diretório do Claude lê o repositório inteiro e manda para revisão manual a versão que faz isso. O `cotrip-openai.zip` sai sem os arquivos do Claude para o portal da OpenAI não ter dois manifestos para escolher.

## Exemplos

- "Vou pra Lisboa de 10 a 16 de maio, monta o roteiro no CoTrip."
- "Distribui os Não planejados da viagem de Tóquio pelos dias."
- "Adiciona os transportes do dia 3."
- "Revisa o roteiro de Roma, tá muito corrido?"

Os agentes autorizados aparecem em https://cotrip.wlln.dev/agentes, onde dá para desconectar.

## Publicar uma versão

1. Suba `version` em `.claude-plugin/plugin.json` e em `openai/plugin.json` (o empacotador recusa versões diferentes).
2. Confira com `claude plugin validate .` e `node scripts/pack-plugin.mjs` (precisa de internet para baixar o ícone).
3. Junte na `main`. O workflow cria a release `v<versão>` com o `cotrip.plugin` e o `cotrip-openai.zip` anexados (também dá para rodar à mão em Actions → Release).
4. Na OpenAI, suba o `cotrip-openai.zip` novo no portal de plugins. Mudanças só no servidor MCP não precisam de pacote novo: o portal lê o servidor de novo todo dia.

Quando as ferramentas do servidor MCP mudarem no CoTrip, revise as skills (elas citam os nomes e as regras das ferramentas) e os casos de teste em `openai/plugin.json` (`extensions.com.openai.review`).
