---
name: preparar-visita
description: Prepara a visita a um ou mais locais de uma viagem no CoTrip (melhor horário, tempo sugerido, destaques, cuidados, como chegar) pesquisando na web e gravando com prepare_visit, no formato padrão ou no que a pessoa pedir. Use quando a pessoa disser "prepara a visita", "pesquisa esse lugar", "o que ver no museu X", "prepara os locais do dia" ou pedir dicas sobre um local que já está no CoTrip.
argument-hint: "[viagem] [local, dia ou 'todos sem preparar']"
---

# Preparar visita

Siga as regras da skill `cotrip`. Aqui você faz o que o botão **Preparar visita** do app faz, com a sua pesquisa, e grava o resultado no local.

## 1. Escolher os locais

`get_trip` e ache os locais pedidos. Locais com `briefing: null` ainda não foram preparados. Para "o dia todo", pegue os locais do dia que não estão visitados. Se forem muitos (mais de 5), diga quantos são e confirme antes, porque cada gravação conta como uma edição no limite semanal do plano gratuito.

## 2. Ler o contexto de cada local

`get_visit` devolve o local, o **dia** (data e cidade) e a visita em uso, se houver. A data importa: confira o dia da semana, feriados e a estação. Se já existe uma visita, leia antes e melhore em vez de repetir.

## 3. Pesquisar

Pesquise na web: horário de funcionamento no dia da visita, ingresso e reserva (antecedência, preço), programação ou eventos na data, o que não perder, filas e melhor horário, como chegar, cuidados (roupas, dinheiro, fechamentos, golpes). Separe o que é fato confirmado do que é recomendação, e não invente horários, preços nem eventos; o que não deu para confirmar fica como "a confirmar".

## 4. Gravar com `prepare_visit`

Formato padrão, que o app mostra em blocos:

- `summary`: 2 a 4 frases sobre o que é e por que vale.
- `bestTime` (curto: "Manhã cedo, antes das 10h") e `reasoning` (por quê).
- `recommendedDurationMinutes`: também vira a duração do local no roteiro.
- `highlights`: "Não deixe de ver", um item por linha.
- `warnings`: "Atenção", o que dá problema se ignorado.
- `sources`: as páginas que você usou.

Se a pessoa pedir outro formato (roteiro dentro do museu, dicas de foto, o que pedir no restaurante, como chegar passo a passo), coloque em `details`, em Markdown simples: parágrafos, `## títulos`, listas com `-`, `**negrito**` e links. Só `summary` é obrigatório; o resto pode ficar de fora se não fizer sentido.

Cada chamada cria uma versão nova no histórico do local e vira a versão em uso; a pessoa pode voltar para uma anterior no app.

## 5. Avisar

Resuma por local o essencial (melhor horário e o principal cuidado) e diga que a visita completa está na tela do local no CoTrip. Se algo pede ação (reservar, comprar ingresso), sugira criar um alerta no dia com `add_note`.
