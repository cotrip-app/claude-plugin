---
name: adicionar-transportes
description: Adiciona transportes no CoTrip, um por trecho, entre os locais de um dia, na chegada e na partida da viagem, e para voos, trens e traslados que a pessoa informar. Use quando a pessoa disser "como vou de um lugar pro outro", "coloca os deslocamentos", "adiciona o voo", "liga os locais do dia" ou colar uma reserva de transporte.
argument-hint: "[viagem] [dia] ou dados da reserva"
---

# Adicionar transportes

Siga as regras da skill `cotrip`. Um transporte é sempre **um trecho**: `from` → `to`. Uma rota com paradas vira vários transportes, na ordem.

## 1. Descobrir os trechos

`get_trip` e, para cada dia pedido, percorra a sequência de itens:

- Entre dois locais seguidos sem transporte entre eles = um trecho.
- Primeiro local do dia: trecho saindo da hospedagem, se a pessoa informou onde fica.
- Último local: volta para a hospedagem, quando fizer sentido (dia longe, noite).
- Dia de chegada/partida: aeroporto/estação ↔ hospedagem.
- Reservas coladas pela pessoa (voo, trem, transfer): use os dados exatos.

Pule trechos que já têm transporte. Não crie trecho entre locais vizinhos óbvios se a pessoa pediu só os principais.

## 2. Escolher o meio

- Inferir quando for claro: voo entre cidades distantes (`plane`); trecho curto no mesmo bairro, até ~15 min andando (`walk`); metrô/trem/ônibus citado pela pessoa ou óbvio na cidade (`metro`, `train`, `bus`).
- Quando não der para saber (carro alugado ou transporte público? táxi ou metrô?), **pergunte uma vez para o dia todo** antes de criar, oferecendo a opção mais comum na cidade.
- Em `details`, escreva como ir de forma prática: linha e sentido, estação de embarque e de saída, tempo aproximado, onde comprar o bilhete. Se não tiver certeza da linha, diga "conferir no Maps" em vez de inventar.
- `departAt` e `arriveAt` só com horário real (reserva ou `timeSlot` dos locais). `code` para número do voo, localizador ou reserva.
- `text` fica para uma observação curta ("Levar passaporte", "Comprar Suica no aeroporto").

## 3. Criar e encaixar

1. `add_note` com `type: "transport"` e o objeto `transport` para cada trecho (eles entram no fim do dia).
2. `get_trip` de novo.
3. `reorder_day` com a lista completa do dia, pondo cada transporte **entre os dois locais que ele liga** (ou no começo/fim para hospedagem e aeroporto).
4. Se encontrar uma nota que na verdade é deslocamento ("pegar metrô até Shibuya"), converta com `update_note` para `transport` em vez de criar outro.

## 4. Fechar

Diga quantos trechos foram criados por dia e quais precisam de confirmação (meio, horário ou linha).
