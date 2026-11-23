---
name: revisar-dia
description: Revisa um ou mais dias de uma viagem no CoTrip e aponta problemas (dia lotado, horário de funcionamento, vai e volta no mapa, transporte faltando, item com tipo errado, reserva sem alerta) com correções prontas para aplicar. Use quando a pessoa pedir "revisa meu dia", "esse dia está bom?", "confere o roteiro", "tá muito corrido?" ou antes de fechar um roteiro.
argument-hint: "[viagem] [dia ou 'todos']"
---

# Revisar dia

Siga as regras da skill `cotrip`. Revisar não edita nada até a pessoa aprovar.

## 1. Ler

`get_trip` e pegue os dias pedidos (todos, se a pessoa disse "o roteiro"). Para cada dia, note a data e o **dia da semana**, a cidade, e a sequência de itens.

## 2. Checar

Para cada dia, procure:

1. **Carga**: soma de `durationMinutes` (90 min quando faltar) + deslocamentos. Mais de ~9h, ou mais de ~5h em dia de chegada/partida = corrido.
2. **Horários**: `timeSlot` fora de `openingHours`; local que fecha naquele dia da semana; atividade de pôr do sol de manhã; dois itens no mesmo horário; horários fora de ordem.
3. **Geografia**: regiões (`area`) que vão e voltam (A → B → A); local de outra cidade no dia; trecho longo no fim da noite.
4. **Transportes**: locais seguidos sem transporte entre eles quando a distância pede; transporte com `from`/`to` que não bate com os locais vizinhos; transporte sem `mode`.
5. **Tipos**: nota que é deslocamento (devia ser `transport`), link de vídeo salvo como nota (devia ser `link`), aviso com consequência salvo como nota (devia ser `alert`), hotel salvo como local ou nota (devia ser hospedagem, `lodging`, com o dia da saída), voo ou trem com companhia, assento ou portão escritos no texto (vão nos campos `carrier`, `number`, `seat` e `gate` do transporte), dica de foto salva como nota (devia ser ponto de foto, `photo`).
6. **Alertas faltando**: reserva obrigatória, ingresso com hora marcada, fechamento cedo, dinheiro vivo, roupa adequada (templos, igrejas).
7. **Básico**: refeição no dia; dia sem título ou com cidade errada; local repetido em dois dias; status `visited`/`missed` em dia futuro.

Só aponte o que for verificável pelos dados ou por fonte que você conferiu. Se suspeitar sem ter como confirmar, diga "vale conferir".

## 3. Relatar

Por dia, no máximo 5 pontos, do mais grave para o menos, cada um com a correção proposta:

> **Sex 14/03 · Asakusa e Ueno** — corrido (≈10h)
> 1. Museu Nacional fecha às 17h e está às 17:30 → trocar com o Senso-ji (fica 09:00 / 15:00).
> 2. Falta transporte Ueno → Akihabara → metrô Ginza Line, ~10 min.
> 3. "Pegar trem pra Nikko" é nota → virar transporte.

Diga também o que está bom, em uma linha, quando o dia estiver redondo.

## 4. Aplicar o que a pessoa aprovar

Use `update_place`, `move_places`, `add_note`/`update_note` e, por último, `get_trip` + `reorder_day`. Remoções (`delete_place`, `delete_note`) só com confirmação explícita; prefira mandar locais para Não planejados. Termine com o resumo do que mudou e o link da viagem (ou do dia) que vem no `url` de `get_trip`.
