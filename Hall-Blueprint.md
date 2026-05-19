# Hall Blueprint (Sprint Unico)

## Escopo
Fechar Hall como bloco completo antes de expandir para novos cenarios.

## Cena principal
Arquivo base: assets/images/hall_principal.png

Hotspots atuais (x,y,w,h em %):
1. Porta de baixo -> Retratos: 55,46,7,11
2. Porta de cima -> Biblioteca (lock): 28,22,7,11
3. Janela -> Jardim (lock): 79,37,8,12
4. Haste de Metal (pickup): 35,66,5,7
5. Entrada Relogio: 43,49,7,16
6. Entrada Retrato Sombrio: 12,40,8,12
7. Entrada Lareira: 83,78,8,9

## Cenas dedicadas Hall
1. Relogio
- imagem: assets/images/scenes/hall_clock_scene.png
- hotspots:
  - Engrenagem (pickup): 50,83,8,9
  - Mecanismo (lock crank): 56,42,10,10

2. Retrato Sombrio
- imagem: assets/images/scenes/hall_portrait_scene.png
- hotspot:
  - Fechadura escondida (lock hairpin): 49,52,9,10

3. Lareira
- imagem: assets/images/scenes/hall_fireplace_scene.png
- hotspot:
  - Brasas ardentes (lock water_jar): 44,63,13,14

## Dependencias externas ao Hall
- Retratos: pegar hairpin e resolver condessa
- Jardim: resolver fonte para safe_button
- Biblioteca: pegar jarro e abrir cofre

## Sequencia minima de teste (regressao)
1. Pegar metal_handle no Hall
2. Pegar gear_piece no Relogio
3. Forjar crank no inventario
4. Usar crank no mecanismo e receber library_key
5. Ir para Retratos e pegar hairpin
6. Voltar Hall e usar hairpin no Retrato para pegar crowbar
7. Usar crowbar na janela e abrir Jardim
8. Ir Biblioteca e pegar water_jar
9. Voltar Hall e usar water_jar na Lareira para pegar medallion

## DoD Hall
- hotspots invisiveis e precisos
- cena fullscreen sem cortes ruins
- lock/unlock com feedback claro
- inventario rapido e acessivel
- sem softlock no fluxo acima
