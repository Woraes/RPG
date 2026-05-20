# GDD - Capítulo 1: A Chave do Faroleiro

## Objetivo deste documento
Este capítulo inaugura a nova base do projeto. Ele foi criado do zero usando o Guia como fonte principal, para evitar herdar dependências narrativas e lógicas da história anterior.

A proposta é servir como capítulo-modelo para futuras histórias no formato escape adventure.

---

## 1. Conceito Geral

### Premissa
A protagonista chega a uma antiga casa de apoio de um farol costeiro logo após uma tempestade. O faroleiro desapareceu, a porta que leva à torre está travada por um mecanismo antigo, e a maré está subindo. Para avançar, ela precisa investigar o interior da casa, interpretar pistas deixadas pelo faroleiro e religar o mecanismo que libera a escada para o topo.

### Promessa de gameplay
O jogador aprende, neste primeiro capítulo, os pilares do jogo:
- explorar um cenário estático procurando lógica visual
- coletar e usar itens em contexto
- resolver um puzzle de observação
- resolver um puzzle de uso de item
- concluir um mini-game mecânico que libera a saída

### Objetivo do capítulo
Liberar a passagem para a torre do farol e subir para o Capítulo 2.

---

## 2. Protagonista e Narrativa

### Protagonista
**Nome:** Liora Voss  
**Função:** Cartógrafa e restauradora de instrumentos náuticos  
**Habilidade especial:** Excelente percepção de padrões visuais e conhecimento de mecanismos antigos

### Justificativa narrativa da habilidade
Liora reconhece símbolos marítimos, ordens de navegação, mecanismos enferrujados e pistas embutidas em objetos antigos. Isso permite que as falas dela deem pistas naturais sem parecer tutorial artificial.

### Conflito imediato
A porta interna que leva à torre do farol está selada por uma trava rotativa de bronze. A maçaneta gira em falso. Sem resolver o mecanismo, Liora não consegue subir.

### Tensão inicial
A casa está segura por enquanto, mas a tempestade deixou tudo úmido, parte da mobília foi deslocada e o tempo sugere urgência. O jogador sente que precisa agir, mas sem cronômetro real.

---

## 3. Estilo Visual e Sonoro

### Estética visual
- Pintura digital semirrealista
- Iluminação dramática vinda de janelas e lampiões
- Madeira úmida, bronze oxidado, vidro fosco, cordas navais, mapas antigos
- Paleta em azul dessaturado, cobre, âmbar e verde-mar apagado

### Linguagem visual da interação
- O cursor não muda sobre objetos
- Os hotspots são invisíveis
- Objetos importantes recebem destaque pela composição da cena, não por ícones flutuantes
- Mudanças relevantes ficam visíveis no cenário: gaveta aberta, banco movido, painel liberado, escotilha destravada

### Clima sonoro
- Chuva distante e mar batendo nas pedras
- Madeira rangendo com o vento
- Pequenos metais, trincos e cliques mecânicos para feedback
- Camada sonora baixa e misteriosa, sem jumpscare

---

## 4. Estrutura do Gameplay

### Cenário principal
O capítulo começa em uma única sala jogável principal: a casa de apoio do farol.

#### Elementos visuais principais da sala
- Porta de entrada trancada atrás da protagonista
- Porta interna para a torre do farol com mecanismo circular de bronze
- Estante com livros náuticos e um espaço vazio entre eles
- Armário alto de mantimentos
- Mesa de trabalho com mapa, lamparina apagada e ferramentas antigas
- Baú marítimo no chão com fechadura por símbolos
- Janela lateral mostrando relâmpagos e o mar
- Banquinho pequeno encostado perto da cama
- Gancho de parede vazio onde claramente faltava algo

### Objetos interativos da cena principal

#### 1. Porta da torre
- Estado inicial: trancada
- Clique sem solução: "A trava não cede. Precisa de alguma sequência ou peça que a ative."
- Após puzzle final: abre e revela a escada para o topo

#### 2. Estante de livros
- Fornece pista de observação
- Um livro com símbolo marítimo específico pode ser puxado
- Há um vazio na prateleira indicando que um item-livro foi removido antes do jogador chegar

#### 3. Armário alto
- Clique inicial: "Tem algo no topo, mas está alto demais."
- Só se torna útil depois de o banco ser movido

#### 4. Banquinho
- Coletável
- Vai para o inventário
- Pode ser arrastado para a frente do armário

#### 5. Mesa de trabalho
- Contém uma chave de fenda enferrujada e um mapa úmido
- O mapa traz parte de uma pista visual

#### 6. Baú marítimo
- Trancado por símbolos
- Leva ao puzzle de observação
- Ao abrir, revela uma manivela de bronze
- Permanece visualmente aberto após resolvido

#### 7. Painel solto na parede
- Não abre na mão
- Precisa de ferramenta
- Atrás dele existe o mini-game mecânico final

#### 8. Gancho vazio
- Serve de pista narrativa
- Mostra que uma peça importante costumava ficar ali

---

## 5. Sistema de Inventário

### Itens coletáveis do capítulo

#### Banquinho dobrável
- Origem: perto da cama
- Uso: arrastado até o armário alto

#### Chave de fenda enferrujada
- Origem: mesa de trabalho
- Uso: remover o painel solto da parede

#### Mapa da costa
- Origem: mesa de trabalho
- Uso: pista visual de observação
- Não é consumido

#### Frasco de óleo
- Origem: topo do armário alto
- Uso: lubrificar parte do mecanismo final

#### Manivela de bronze
- Origem: dentro do baú marítimo
- Uso: encaixada no mecanismo da porta da torre

### Regras de inventário do capítulo
- Itens de pista podem permanecer no inventário sem consumo
- Itens físicos de uso mecânico podem ser consumidos visualmente pelo cenário
- O banco, por regra visual, deve aparecer no cenário após ser colocado

---

## 6. Os Três Puzzles do Capítulo

### Puzzle 1 - Observação

#### Nome
Código do baú marítimo

#### Tipo
Observação do cenário

#### Setup
A estante possui um livro com símbolo de maré. O mapa da mesa mostra quatro pontos costeiros marcados com ícones. Em um quadro pequeno próximo à janela há uma rosa dos ventos com marcas discretas.

#### Lógica
O jogador precisa perceber que:
- o livro da estante mostra o símbolo de maré correto
- o mapa indica a ordem dos quatro pontos
- a rosa dos ventos sugere a direção de leitura

Isso leva à sequência correta de símbolos do baú.

#### Resultado
- O baú abre
- A imagem do baú muda para estado aberto
- O jogador coleta a manivela de bronze

#### Feedback de erro
"Os símbolos não parecem aleatórios. Deve haver alguma pista na sala."

---

### Puzzle 2 - Manipulação de itens

#### Nome
Alcançar o óleo no topo do armário

#### Tipo
Uso de item no cenário

#### Setup
O frasco de óleo está visível no alto do armário, mas fora de alcance.

#### Lógica
- O jogador encontra o banquinho
- Seleciona ou arrasta o banquinho até a frente do armário
- O banco passa a aparecer na sala nessa nova posição
- A interação do topo do armário é liberada

#### Resultado
- O jogador coleta o frasco de óleo
- O banco permanece no lugar como prova visual da ação

#### Feedback de erro sem o banco
"Não consigo alcançar dali."

#### Feedback após posicionar o banco
"Agora sim. Daqui consigo pegar isso."

---

### Puzzle 3 - Mini-game mecânico

#### Nome
Trava rotativa do farol

#### Tipo
Mini-game mecânico

#### Setup
Atrás do painel da parede existe um mecanismo antigo com trilhas metálicas e encaixes giratórios. Falta uma manivela e uma parte está emperrada.

#### Pré-condições
O jogador precisa:
- remover o painel com a chave de fenda
- ter a manivela de bronze
- usar o frasco de óleo no eixo travado

#### Lógica do mini-game
- O jogador encaixa a manivela no mecanismo
- Em seguida, entra numa interface dedicada com peças giratórias
- O objetivo é alinhar três trilhas metálicas para levar energia mecânica do disco central até a trava da porta
- Algumas peças giram em conjunto, exigindo leitura espacial simples

#### Resultado
- O mecanismo destrava
- A porta da torre abre
- Sons metálicos de destrancamento tocam
- A escada em espiral fica visível ao fundo

#### Feedback de erro
- peça fora do lugar: som seco e retorno parcial
- tentativa antes do óleo: "O eixo mal se move. Está travado pela ferrugem."

---

## 7. Progressão Passo a Passo

### O que o jogador vê primeiro
Ao entrar, Liora encara a porta para a torre, o baú marítimo, a estante e a mesa de trabalho. A composição visual deixa claro que a saída está bloqueada e que o resto da sala contém respostas.

### Primeiro item a ser coletado
A chave de fenda enferrujada, na mesa de trabalho.

### Primeira conclusão do jogador
A porta da torre não abre diretamente, então é preciso examinar o mecanismo e a sala em volta.

### Fluxo lógico ideal
1. O jogador tenta abrir a porta da torre e falha.
2. Examina a mesa e pega a chave de fenda e o mapa.
3. Observa a estante, o livro destacado e o quadro da rosa dos ventos.
4. Resolve o baú marítimo com base nas pistas visuais.
5. Abre o baú e pega a manivela de bronze.
6. Tenta resolver o mecanismo cedo demais e descobre que ele está travado.
7. Explora o armário alto e percebe o frasco inacessível.
8. Coleta o banquinho.
9. Arrasta o banquinho para a frente do armário.
10. Pega o frasco de óleo.
11. Usa a chave de fenda para abrir o painel da parede.
12. Usa o óleo no eixo travado.
13. Encaixa a manivela.
14. Resolve o mini-game mecânico.
15. A porta da torre abre e o capítulo termina.

### Obstáculo que exige item
O painel da parede exige a chave de fenda. O mecanismo exige óleo e manivela. O armário alto exige o banco.

### Puzzle final que libera a saída
O mini-game da trava rotativa do farol.

---

## 8. Diálogos e Falas Curtas

### Fala inicial da protagonista
"Se o faroleiro deixou algo para trás, está nesta sala. E a torre é o único caminho."

### Ao clicar na porta da torre antes de tudo
"Selada. Não é só uma fechadura comum."

### Ao clicar no baú antes de ler pistas
"Esses símbolos devem significar alguma coisa."

### Ao clicar no armário alto sem solução
"Vejo um frasco lá em cima, mas não alcanço."

### Ao encontrar a manivela
"Isso parece faltar em algum mecanismo."

### Ao tentar girar o mecanismo sem óleo
"Forçar isso agora só vai quebrar tudo."

### Ao abrir a porta no fim
"Pronto. Se ele foi para algum lugar, foi para cima."

---

## 9. Estados Visuais Persistentes

### Estado 1 - Baú aberto
- Antes: baú fechado
- Depois: tampa aberta e interior vazio
- Flag: `chest_opened`

### Estado 2 - Banco movido
- Antes: banco perto da cama
- Depois: banco diante do armário alto
- Flag: `stool_placed`

### Estado 3 - Painel removido
- Antes: painel fechado
- Depois: mecanismo exposto
- Flag: `panel_opened`

### Estado 4 - Porta da torre liberada
- Antes: porta selada
- Depois: porta entreaberta com escada visível
- Flag: `tower_unlocked`

---

## 10. Objetivo de produção deste capítulo

Este capítulo foi desenhado para ser pequeno, claro e reutilizável como padrão. Ele valida:
- leitura de cenário estático
- inventário com item de posição no mundo
- mudança visual persistente
- puzzle de observação
- puzzle de uso contextual
- mini-game mecânico em overlay
- fechamento forte para puxar o próximo capítulo

---

## 11. Gancho para o Capítulo 2
Ao subir a escada, Liora encontra a sala da lanterna do farol parcialmente destruída. A luz foi sabotada de dentro para fora, e há marcas molhadas no metal, como se alguém tivesse subido à torre carregando algo vindo do mar.

---

## 12. Próxima derivação técnica
A partir deste GDD, o próximo documento pode ser quebrado em quatro artefatos de produção:
- blueprint da sala com hotspots
- lista técnica de itens
- blueprint das cenas dedicadas
- blueprint do mini-game mecânico
