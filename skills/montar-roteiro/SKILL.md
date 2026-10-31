---
name: montar-roteiro
description: Monta uma viagem no CoTrip do zero, a partir de uma conversa, de uma lista de lugares ou de um roteiro colado (blog, PDF, mensagem). Use quando a pessoa disser "monta meu roteiro", "cria a viagem no CoTrip", "planeja X dias em Y", "coloca esses lugares no CoTrip" ou colar uma lista de lugares.
argument-hint: "[destino e datas, ou lista de lugares]"
---

# Montar roteiro do zero

Siga as regras da skill `cotrip`. O objetivo é sair com uma viagem no CoTrip em que cada dia faz sentido no mapa e no relógio, e que a pessoa só precise ajustar detalhes.

## 1. Entender a viagem (uma rodada de perguntas, no máximo)

Pegue do que a pessoa já disse e pergunte só o que faltar, tudo de uma vez:

- Destino(s) e datas de ida e volta. Se forem várias cidades, quantas noites em cada.
- Hospedagem (bairro ou endereço) em cada cidade: é o ponto de partida e de volta de cada dia.
- Horários de chegada e partida (voos, trens), se já existirem.
- Ritmo: tranquilo (2–3 atividades por dia), equilibrado (3–4) ou intenso (5+).
- Interesses e restrições: comida, museus, natureza, compras, vida noturna, crianças, mobilidade, orçamento.
- O que é imperdível e o que já está reservado (com dia e hora).

Se a pessoa colou uma lista ou um roteiro, extraia os lugares e confirme só o que for ambíguo (ex.: duas "Torre" na mesma cidade).

## 2. Viagem e dias

1. `list_trips`: se já existir uma viagem com o mesmo destino e datas, pergunte se é para usar essa em vez de criar outra.
2. `create_trip` com nome curto ("Japão 2027"), destino e datas.
3. `get_trip` para pegar os IDs dos dias.
4. `update_day` em cada dia com a cidade certa (quando houver mais de uma) e um título que diga o tema do dia ("Chegada", "Asakusa e Ueno", "Bate-volta a Nikko", "Volta").

## 3. Locais

1. Monte a lista de candidatos: os pedidos da pessoa + sugestões suas que combinem com os interesses. Mantenha as sugestões no tamanho do ritmo escolhido; é melhor faltar do que lotar.
2. Mostre a lista em blocos por região e marque o que é sugestão sua. Peça um ok antes de criar.
3. Crie com `add_place` **sem dayId** (vão para Não planejados), preenchendo `area`, `category`, `durationMinutes`, `priority` e, quando souber de fonte confiável, `openingHours` e `mapsUrl`. Imperdíveis da pessoa = `high`; sugestões suas = `medium` ou `optional`.

## 4. Distribuir e ligar

1. Use a skill `distribuir-locais` para levar os locais aos dias.
2. Use a skill `adicionar-transportes` para os trechos entre locais, a chegada e a volta.
3. Se a pessoa contou onde vai ficar, crie a hospedagem (`add_note` com `type` = `lodging`) no dia do check-in, com o dia da saída em `checkOutDayId`. Uma por estadia.
4. Coloque alertas (`alert`) para reservas obrigatórias, dias de fechamento e horários-limite.
5. Rode a skill `revisar-dia` em cada dia e corrija o que ela apontar.

## 5. Entregar

Responda com um resumo por dia (título + 1 linha com os principais locais), o que ficou em Não planejados e por quê, e o que ainda precisa de decisão da pessoa (reservas, horários a confirmar). Feche com o link da viagem (o `url` que `create_trip` devolve), para ela abrir no CoTrip e arrastar itens para ajustar.
