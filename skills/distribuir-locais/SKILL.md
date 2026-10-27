---
name: distribuir-locais
description: Distribui os locais de uma viagem do CoTrip pelos dias, agrupando por região, respeitando horários de funcionamento, prioridades e o ritmo da pessoa, e deixa cada dia na ordem certa. Use quando a pessoa pedir para "organizar os dias", "distribuir os lugares", "planejar os Não planejados", "rebalancear o roteiro" ou "encaixar esses lugares".
argument-hint: "[viagem] [dias ou locais específicos]"
---

# Distribuir locais pelos dias

Siga as regras da skill `cotrip`.

## 1. Ler o estado atual

`get_trip`. Separe:
- **Fixos**: locais já em dias com `timeSlot` definido, reservas, ou que a pessoa disse para não mexer. Não mova sem perguntar.
- **A distribuir**: `unplanned` + os que a pessoa pediu para reorganizar.
- **Capacidade de cada dia**: cidade do dia, chegada/partida (transportes já lançados), dias da semana. Primeiro e último dia valem metade ou menos.

Se faltar `area` em locais a distribuir, deduza pelo nome/link ou pergunte; sem região não dá para agrupar.

## 2. Planejar (sem editar ainda)

Regras, nesta ordem de prioridade:

1. **Cidade**: só coloque um local num dia daquela cidade.
2. **Restrições de data e hora**: dias de fechamento (`openingHours`), eventos com data, reservas. Museus costumam fechar segunda; confira o que estiver no local.
3. **Região**: um dia = uma ou duas regiões vizinhas. Evite atravessar a cidade e voltar.
4. **Carga**: some `durationMinutes` (use 90 min se faltar) + ~30 min por deslocamento. Mire em até ~8h num dia equilibrado, ~6h no tranquilo, ~10h no intenso. Inclua refeição.
5. **Prioridade**: `high` primeiro. Se não couber, `optional` volta para Não planejados (não apague).
6. **Ordem dentro do dia**: o que abre cedo ou lota (mirantes, atrações famosas) de manhã; museus no meio do dia; mirantes e bairros de noite no fim; termine perto da hospedagem ou do jantar.
7. **Variedade**: alterne tipos (não três museus seguidos) quando der.

Defina `timeSlot` aproximado para cada local ("09:00", "Almoço", "Fim de tarde").

Mostre o plano para a pessoa como uma lista por dia (local — região — horário) e o que sobrou. Peça um ok. Se ela já pediu para aplicar direto, aplique.

## 3. Aplicar

1. `move_places` por dia, com os `placeIds` **já na ordem planejada** (entram no fim do dia nessa ordem).
2. `update_place` só onde precisar mudar `timeSlot`, `priority` ou `status`.
3. Se o dia já tinha itens (notas, transportes, locais fixos), `get_trip` e então `reorder_day` com a lista completa na ordem final, encaixando os transportes entre os locais que eles ligam.
4. Locais que não couberam: `move_places` com `dayId: null`.

## 4. Fechar

Resuma o que foi para cada dia e o que ficou de fora. Sugira rodar `adicionar-transportes` se os trechos ainda não estiverem lançados.
