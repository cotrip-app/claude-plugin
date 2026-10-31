---
name: cotrip
description: Regras para ler e editar viagens no CoTrip pelas ferramentas do conector (list_trips, get_trip, add_place, move_places, reorder_day, add_note, prepare_visit...). Use sempre que a pessoa falar de uma viagem, roteiro, dia ou local do CoTrip, pedir para "colocar no CoTrip", ou quando outra skill do CoTrip for usada.
---

# Como trabalhar com o CoTrip

O CoTrip organiza uma viagem em **dias** (um por data, com cidade e título) e uma lista de **Não planejados** (locais ainda sem dia). Cada dia tem uma sequência única de itens, misturando **locais** e **itens do dia** (nota, alerta, checklist, transporte, hospedagem, link e arquivo). A ordem dessa sequência é o roteiro que a pessoa vê no celular.

## Antes de mexer

1. Se as ferramentas do CoTrip não estiverem disponíveis, peça para a pessoa conectar o CoTrip (no Claude Code: `/mcp`, escolher `cotrip` e autenticar; no Claude, ChatGPT ou Codex: ativar o CoTrip nos conectores ou plugins). Ela entra com o e-mail e autoriza.
2. Comece com `list_trips`. Se houver mais de uma viagem possível, pergunte qual. Para uma viagem nova, use `create_trip` (cria um dia por data, até 90).
3. Chame `get_trip` e use só IDs que vieram dele. Nunca invente IDs. Chame `get_trip` de novo depois de uma sequência de mudanças, antes de reordenar ou revisar.

## Ferramentas e pegadinhas

| Ferramenta | Uso | Atenção |
|---|---|---|
| `list_trips`, `get_trip` | Ler | Leitura é sempre liberada. Viagens e dias trazem `url`, o endereço deles no app |
| `create_trip`, `update_trip` | Viagem | Devolvem a `url` da viagem. Mande `startDate` e `endDate` juntos. A viagem fica com um dia por data; dias vazios fora do intervalo saem, e os que têm itens voltam em `keptOutside` (mova os itens e chame de novo) |
| `update_day` | Título e cidade do dia | Títulos curtos: "Chegada", "Bate-volta a Nikko" |
| `add_place` | Local novo | Com `dayId` entra no **fim** do dia; sem `dayId` vai para Não planejados. Mande `mapsUrl` quando tiver. Se já existe, volta `added=false` (não duplique) |
| `update_place` | Campos do local | Não troca o dia; para isso, `move_places` |
| `get_visit`, `prepare_visit` | Preparar a visita a um local | Veja a skill `preparar-visita`. Não gasta crédito de IA do CoTrip |
| `move_places` | Levar locais para um dia | Entram no **fim** do dia, na ordem enviada. `dayId: null` devolve para Não planejados |
| `reorder_day` | Ordem final do dia | Envie **todos** os itens do dia (locais e notas), cada um como `{kind, id}`, sem faltar nem repetir |
| `add_note` | Item do dia | Entra no fim do dia, ou junto de outro item com `beforeId`/`afterId` |
| `add_reminder`, `update_checklist` | Lembretes e tarefas | Veja a skill `lembretes`. Reaproveite a checklist que já existe para o mesmo momento |
| `update_note` | Editar item | Troque o tipo em vez de apagar e recriar, para manter a posição |
| `delete_place`, `delete_note` | Remover | Não dá para desfazer: confirme com a pessoa antes |

Fluxo para montar um dia: `move_places` (ou `add_place` com `dayId`) → `add_note` para transportes e alertas → `get_trip` → `reorder_day` com a ordem final.

## Campos do local

- `status`: `wishlist` (quero ir), `planned` (planejado), `visited`, `missed`. Locais movidos para um dia viram planejados.
- `priority`: `high`, `medium`, `optional`. Use `optional` para o que pode cair se o dia apertar.
- `durationMinutes`: tempo previsto no local (5 a 1440).
- `timeSlot`: horário planejado em texto curto ("09:30", "Manhã", "Pôr do sol").
- `openingHours`: horário de funcionamento em texto ("Ter–Dom 9h–17h, fecha seg").
- `area`: bairro ou região. É o campo que agrupa locais próximos, então preencha sempre.
- `category`: "Museu", "Restaurante", "Parque", "Mirante", "Templo"...
- `note`: observação do local, aparece na tela do local no app ("Reservar o minitrekking", "Pedir o cordeiro"). Pesquisa sobre o local vai em `prepare_visit`, não aqui.

## Tipos de item do dia

Escolha pelo que o item é; não crie tudo como nota.

- **transport**: qualquer deslocamento. Uma rota com paradas vira um transporte por trecho, na ordem. Preencha `mode` (`plane`, `train`, `metro`, `bus`, `car`, `walk`, `boat`, `other`), `from`, `to`, e quando souber `departAt`/`arriveAt` (HH:MM), `details` (linha, plataforma, onde comprar o bilhete) e `code` (voo, reserva, localizador). Se o meio não der para inferir, pergunte antes de criar.
- **link**: vídeos (YouTube, TikTok, Instagram) e páginas úteis, com um `title` que diga do que se trata. YouTube aparece como vídeo no roteiro.
- **alert**: aviso com consequência se ignorado ("Fecha às 17h", "Precisa reservar", "Só aceita dinheiro").
- **checklist**: tarefas que a pessoa precisa fazer (comprar, reservar, levar, confirmar). `text` é o título; as tarefas vão em `checklist.items`. Pedidos do tipo "me lembra de…" usam `add_reminder` (skill `lembretes`).
- **lodging**: hospedagem (hotel, Airbnb, casa de amigos). Um item por estadia, no dia do check-in, com `lodging.checkOutDayId` = dia da saída. Preencha `name` e, quando souber, `address`, `checkInAt`/`checkOutAt` (HH:MM), `code` (reserva, localizador), `details` (quarto, café incluso) e `info` (Wi-Fi, telefone, como pegar a chave). O app mostra sozinho "Saindo de" e "Dormindo em" em cada dia; se a pessoa troca de hotel, crie outra hospedagem no dia da troca.
- **note**: o resto (ideias, observações).
- Arquivos (fotos, PDFs, passagens) só entram pelo app; diga isso se a pessoa pedir.

## Limites

- As **edições** por agente podem ter limite semanal na conta (ler não conta). Se aparecer o aviso de limite, pare, explique o que a mensagem disse e diga o que ficou sem fazer. Não fique tentando de novo.
- Por isso, planeje antes de editar: monte a proposta, mostre para a pessoa, e só então aplique em lote, sem chamadas de teste nem idas e vindas.

## Jeito de conversar

- Fale no idioma da pessoa. Datas no formato dela (ex.: "sex, 14/03").
- Antes de uma mudança grande (mais de um dia, remoções, troca de datas), mostre o plano em texto curto e peça um ok.
- Depois de aplicar, resuma o que mudou por dia e lembre que ela pode ajustar arrastando no app.
- Sempre que criar ou mudar algo, termine a resposta com o link da viagem (`url`), como link clicável: "[Abrir no CoTrip](url)". Se só um dia mudou, use o `url` do dia. Use só links que vieram das ferramentas; não monte o endereço na mão.
- Não invente horários de funcionamento, preços ou regras. Se pesquisar na web, diga que conferiu e quando; se não deu para conferir, marque como "a confirmar".
