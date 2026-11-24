---
name: lembretes
description: Guarda lembretes e pendências da viagem como tarefas em checklists do CoTrip, na checklist certa e no ponto certo do roteiro, e marca o que já foi feito. Use quando a pessoa disser "me lembra de…", "não posso esquecer de…", "preciso resolver/comprar/reservar…", "anota pra eu fazer…", "já fiz X" ou perguntar "o que falta resolver?".
---

# Lembretes e pendências no CoTrip

Lembretes viram **tarefas** dentro de uma **checklist** do roteiro (item do dia com `type = checklist`). A checklist tem um título que diz o momento (ex.: "Antes de viajar", "Antes do Louvre", "Check-out") e fica no dia e na posição em que a pessoa vai precisar dela. No app, a pessoa marca as tarefas e vê quantas pendências cada dia tem.

Siga também as regras da skill `cotrip`.

## Guardar um lembrete

1. Ache a viagem (`list_trips`; se houver mais de uma possível e o contexto não disser, pergunte) e leia com `get_trip`. Anote as checklists que já existem: dia, título e tarefas.
2. Decida **quando** a tarefa precisa ser feita:
   - **Antes da viagem** (comprar chip, seguro, trocar dinheiro, reservar com antecedência, tirar visto): checklist "Antes de viajar" no **começo do primeiro dia** (`beforeId` = primeiro item do dia).
   - **Num dia, local ou deslocamento** (levar o passaporte no passeio, pegar o audioguia, imprimir o bilhete do trem): checklist daquele dia, **logo antes** do local ou transporte a que ela se refere (`beforeId`). Se vale para o dia todo, no começo do dia.
   - **Na volta** (check-out, devolver o carro, pedir o tax free): no último dia, antes do transporte de volta.
   - Se não der para saber o momento, use "Antes de viajar" e diga isso à pessoa.
3. **Reaproveite**: se já existe uma checklist para esse momento (mesmo dia e mesmo assunto), use `add_reminder` com `checklistId`. Não crie uma checklist por tarefa.
4. Se não existe, use `add_reminder` com `newChecklist` (`dayId`, `title` curto, `beforeId` ou `afterId`).
5. Escreva cada tarefa como ação curta começando com verbo ("Comprar chip de celular", "Reservar mesa no Dishoom"). Vários pedidos na mesma frase viram várias tarefas na mesma chamada.
6. Responda dizendo onde ficou ("Coloquei em **Antes do Louvre**, no dia 2, logo antes do museu") e termine com o link do dia (`url` que vem na resposta).

Exemplos:

| A pessoa diz | Vai para |
|---|---|
| "Me lembra de comprar um adaptador de tomada" | "Antes de viajar", começo do dia 1 |
| "Não posso esquecer de levar o ingresso impresso no Louvre" | "Antes do Louvre", logo antes do Louvre |
| "Preciso fazer o check-out até 11h no dia da ida pra Londres" | "Check-out", começo daquele dia, antes do trem |
| "Anota: reservar o jantar e comprar o ingresso do musical em Londres" | Duas tarefas numa checklist do dia em Londres |

Se o lembrete tem **consequência** se for ignorado e não é uma ação da pessoa ("o museu fecha às 17h"), é um `alert`, não uma tarefa.

## Marcar, editar e consultar

- "Já comprei o chip": ache a tarefa no `get_trip` e use `update_checklist` com `check` (ids das tarefas). `uncheck` desmarca, `edit` muda o texto, `remove` tira, `add` acrescenta, `title` renomeia.
- "O que falta resolver?": liste as tarefas com `done = false` de todas as checklists da viagem, agrupadas por dia e checklist. Leitura não gasta edições.
- Para mover a checklist inteira, use `update_note` (`dayId`) ou `reorder_day`.
- Apagar a checklist (`delete_note`) só com confirmação.
