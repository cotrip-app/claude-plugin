# Plugin do CoTrip para Claude

Conecta o Claude ao [CoTrip](https://cotrip.wlln.dev) e ensina a montar roteiros do jeito que o app funciona.

## O que vem nele

- **Conector CoTrip**: o servidor MCP `https://cotrip.wlln.dev/api/mcp`. Na primeira vez, o Claude abre o CoTrip para você entrar com o e-mail e autorizar. Não tem chave nem configuração.
- **Agente `planejador-de-roteiros`**: monta ou reorganiza a viagem inteira, passando pelas skills abaixo.
- **Skills**:
  - `cotrip`: regras para ler e editar viagens (IDs, ordem do dia, tipos de item, limites).
  - `montar-roteiro`: cria a viagem do zero a partir de uma conversa, lista de lugares ou roteiro colado.
  - `distribuir-locais`: leva os locais aos dias por região, horário, prioridade e ritmo.
  - `adicionar-transportes`: lança um transporte por trecho e encaixa entre os locais.
  - `revisar-dia`: aponta dia corrido, horário errado, ida e volta no mapa, alertas faltando.
  - `lembretes`: "me lembra de…" vira tarefa numa checklist do roteiro, no dia e no ponto certos; marca o que já foi feito e lista o que falta.
  - `preparar-visita`: pesquisa cada local (melhor horário, destaques, cuidados) e grava a visita no CoTrip, no formato padrão ou no que você pedir.

## Instalar

**Claude Code**

```
/plugin marketplace add cotrip-app/claude-plugin
/plugin install cotrip@cotrip
```

Depois rode `/mcp`, escolha `cotrip` e autentique.

**Claude (app e claude.ai)**

Adicione o marketplace `cotrip-app/claude-plugin` na área de plugins, ou baixe o `cotrip.plugin` da [versão mais recente](https://github.com/cotrip-app/claude-plugin/releases/latest/download/cotrip.plugin). Se preferir só o conector, abra o [CoTrip no diretório do Claude](https://claude.ai/directory/cotrip) e toque em Conectar.

## Exemplos

- "Vou pra Lisboa de 10 a 16 de maio, monta o roteiro no CoTrip."
- "Distribui os Não planejados da viagem de Tóquio pelos dias."
- "Adiciona os transportes do dia 3."
- "Revisa o roteiro de Roma, tá muito corrido?"

Os agentes autorizados aparecem em https://cotrip.wlln.dev/agentes, onde dá para desconectar.

Licença MIT. Suporte: https://github.com/cotrip-app/claude-plugin/issues
