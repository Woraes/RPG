/**
 * STORY DATABASE (story.js)
 * Definição completa da história de demonstração "O Mistério da Cozinha"
 * Servirá como template oficial para futuras histórias criadas pelo usuário
 */

const STORY_DATA = {
  // Metadados da História
  metadata: {
    id: "chave_faroleiro_cap01",
    title: "A Chave do Faroleiro - Capítulo 01",
    author: "Liora Voss",
    chapter: 1,
    startingRoom: "casa_farol"
  },

  // Catálogo de Itens Coletáveis e Utilizáveis
  items: {
    banquinho_dobravel: {
      id: "banquinho_dobravel",
      name: "Banquinho Dobrável",
      emoji: "🪑",
      sprite: "banquinho_dobravel.png",
      description: "Um banquinho pequeno e leve. Pode ser arrastado para alcançar lugares altos."
    },
    chave_fenda_enferrujada: {
      id: "chave_fenda_enferrujada",
      name: "Chave de Fenda Enferrujada",
      emoji: "🔧",
      sprite: "chave_fenda_enferrujada.png",
      description: "Ferramenta de metal com cabo de madeira. A ponta está oxidada mas ainda funciona."
    },
    mapa_costa: {
      id: "mapa_costa",
      name: "Mapa da Costa",
      emoji: "🗺️",
      sprite: "mapa_costa.png",
      description: "Mapa antigo marcando pontos costeiros. Contém pistas visuais sobre os símbolos do baú."
    },
    frasco_oleo: {
      id: "frasco_oleo",
      name: "Frasco de Óleo",
      emoji: "🧴",
      sprite: "frasco_oleo.png",
      description: "Óleo lubrificante com aroma de âmbar. Serve para desferrujar mecanismos oxidados."
    },
    manivela_bronze: {
      id: "manivela_bronze",
      name: "Manivela de Bronze",
      emoji: "🔩",
      sprite: "manivelamontada.png",
      description: "Peça de bronze pesada com encaixes específicos. Parece faltar em algum mecanismo importante."
    }
  },

  // Receitas de Combinação de Itens na Forja
  combinations: [
    // Neste capítulo, não há combinações de forja
  ],

  // Puzzles de Tela Dedicada
  puzzles: {
    puzzle_baú_marítimo: {
      title: "Código do Baú Marítimo",
      image: "assets/images/scenes/baú_marítimo_closed.png",
      story: "O baú está trancado com um mecanismo de símbolos. Não é coincidência.",
      clue: "Procure pistas na sala: o mapa, o livro, a rosa dos ventos... Tudo aponta para uma sequência.",
      kind: "sequence",
      options: ["Maré", "Cima", "Direita", "Baixo", "Esquerda"],
      answer: ["Maré", "Cima", "Direita", "Baixo", "Esquerda"],
      successMessage: "Um clique mecânico reverbera. A tampa do baú se abre lentamente.",
      failMessage: "Os símbolos não encaixam. Tente novamente."
    },

    puzzle_mecanismo_trava: {
      title: "Trava Rotativa do Farol",
      image: "assets/images/scenes/painel_mecanismo.png",
      story: "A porta está travada por um mecanismo antigo de trilhas metálicas. Preciso conectar a energia.",
      clue: "A manivela encaixa no topo. O óleo deve ser aplicado ao eixo oxidado primeiro.",
      kind: "mechanical",
      successMessage: "Um ruído mecânico profundo reverbera. A porta da torre se abre lentamente.",
      failMessage: "As trilhas não alinham. O sistema resiste.",
      requiresItem: "manivela_bronze",
      prerequisiteFlag: "painel_aberto"
    }
  },

  // Cenários do Jogo (Salas e Conexões)
  rooms: {
    casa_farol: {
      title: "Casa de Apoio do Farol",
      image: "assets/images/scenes/casa_farol_principal.png",
      intro: "O mar ruge lá fora. Preciso destrancar a torre do farol para sinalizar ajuda antes que a tempestade piore.",
      goal: "A porta para a torre está travada. Encontre a manivela correta e libere o mecanismo.",
      
      // Sobreposições visuais (overlays) condicionadas a flags
      overlays: [
        {
          flag: "puzzle_baú_resolvido",
          image: "assets/images/scenes/baú_marítimo_open.png",
          x: 8,
          y: 75,
          w: 15,
          h: 18
        },
        {
          flag: "banco_posicionado",
          image: "assets/images/itens/banquinho_dobravel.png",
          x: 75,
          y: 80,
          w: 5,
          h: 8
        },
        {
          flag: "painel_aberto",
          image: "assets/images/scenes/painel_mecanismo.png",
          x: 85,
          y: 70,
          w: 10,
          h: 15
        },
        {
          flag: "trava_destrancada",
          image: "assets/images/scenes/trava_destrancada.png",
          x: 45,
          y: 15,
          w: 10,
          h: 20
        }
      ],

      // Áreas interativas invisíveis na cena principal
      hotspots: [
        // 1. Porta da Torre (bloqueada até resolver trava)
        {
          id: "porta_torre",
          label: "Porta da Torre do Farol",
          x: 45,
          y: 15,
          w: 10,
          h: 20,
          action: {
            type: "message",
            message: "A trava não cede. Precisa de alguma sequência ou peça que a ative."
          },
          activeIfFlag: "trava_destrancada"
        },

        // 2. Estante de Livros com close-up
        {
          id: "estante_livros",
          label: "Estante de Livros Náuticos",
          x: 10,
          y: 30,
          w: 15,
          h: 40,
          action: {
            type: "scene",
            scene: {
              id: "closeup_estante",
              title: "Livros Antigos",
              image: "assets/images/scenes/estante_livros_closeup.png",
              overlays: [
                {
                  flag: "livro_puxado",
                  image: "assets/images/scenes/estante_livros_open.png",
                  x: 0,
                  y: 0,
                  w: 100,
                  h: 100
                }
              ],
              hotspots: [
                {
                  id: "livro_maré",
                  label: "Livro com Símbolo de Maré",
                  x: 45,
                  y: 55,
                  w: 15,
                  h: 25,
                  action: {
                    type: "message",
                    setFlag: "livro_puxado",
                    message: "Você puxa o livro com o símbolo de maré. Um ruído metálico indica que algo se moveu."
                  },
                  inactiveIfFlag: "livro_puxado"
                }
              ]
            }
          }
        },

        // 3. Mesa de Trabalho
        {
          id: "mesa_trabalho",
          label: "Mesa de Trabalho",
          x: 35,
          y: 60,
          w: 20,
          h: 20,
          action: {
            type: "scene",
            scene: {
              id: "closeup_mesa",
              title: "Mesa com Ferramentas",
              image: "assets/images/scenes/mesa_trabalho_closed.png",
              overlays: [
                {
                  requiredFlags: ["picked_mapa", "picked_chave_fenda"],
                  image: "assets/images/scenes/mesa_trabalho_open.png",
                  x: 0,
                  y: 0,
                  w: 100,
                  h: 100
                }
              ],
              hotspots: [
                {
                  id: "chave_fenda_pickup",
                  label: "Chave de Fenda Enferrujada",
                  x: 30,
                  y: 50,
                  w: 10,
                  h: 15,
                  action: {
                    type: "pickup",
                    itemId: "chave_fenda_enferrujada",
                    flag: "picked_chave_fenda"
                  },
                  inactiveIfFlag: "picked_chave_fenda"
                },
                {
                  id: "mapa_pickup",
                  label: "Mapa da Costa",
                  x: 70,
                  y: 45,
                  w: 15,
                  h: 20,
                  action: {
                    type: "pickup",
                    itemId: "mapa_costa",
                    flag: "picked_mapa"
                  },
                  inactiveIfFlag: "picked_mapa"
                }
              ]
            }
          }
        },

        // 4. Armário Alto (bloqueado até banco ser posicionado)
        {
          id: "armario_alto",
          label: "Armário Alto",
          x: 75,
          y: 40,
          w: 12,
          h: 40,
          action: {
            type: "message",
            message: "Há um frasco no topo, mas está fora de alcance. Preciso de algo para subir."
          },
          inactiveIfFlag: "banco_posicionado"
        },

        // 5. Frasco de Óleo (só aparece depois que banco é posicionado)
        {
          id: "topo_armario_oleo",
          label: "Frasco de Óleo",
          x: 75,
          y: 35,
          w: 8,
          h: 10,
          action: {
            type: "pickup",
            itemId: "frasco_oleo",
            flag: "picked_oleo"
          },
          activeIfFlag: "banco_posicionado",
          inactiveIfFlag: "picked_oleo"
        },

        // 6. Baú Marítimo (puzzle de observação)
        {
          id: "bau_maritimo",
          label: "Baú Marítimo Trancado",
          x: 8,
          y: 75,
          w: 15,
          h: 18,
          action: {
            type: "puzzle",
            puzzleId: "puzzle_baú_marítimo",
            onSuccess: {
              flag: "puzzle_baú_resolvido",
              message: "Um clique mecânico reverbera. A tampa do baú se abre!",
              reward_location: "interior do baú"
            }
          },
          inactiveIfFlag: "puzzle_baú_resolvido"
        },

        // 7. Manivela dentro do baú (coletável após resolver puzzle do baú)
        {
          id: "manivela_no_bau",
          label: "Manivela de Bronze",
          x: 8,
          y: 85,
          w: 10,
          h: 8,
          action: {
            type: "pickup",
            itemId: "manivela_bronze",
            flag: "picked_manivela"
          },
          activeIfFlag: "puzzle_baú_resolvido",
          inactiveIfFlag: "picked_manivela"
        },

        // 8. Painel Solto na Parede (requer chave de fenda)
        {
          id: "painel_solto",
          label: "Painel Solto na Parede",
          x: 85,
          y: 70,
          w: 10,
          h: 15,
          action: {
            type: "message",
            message: "O painel está solto. Preciso de uma ferramenta para removê-lo."
          },
          condition: "chave_fenda_enferrujada",
          conditionFailedMessage: "Preciso de uma ferramenta para remover este painel.",
          onUseItem: {
            item: "chave_fenda_enferrujada",
            setFlag: "painel_aberto",
            message: "Você usa a chave de fenda para remover o painel."
          },
          inactiveIfFlag: "painel_aberto"
        },

        // 9. Mecanismo da Trava (atrás do painel, mini-game)
        {
          id: "mecanismo_trava",
          label: "Mecanismo da Trava Rotativa",
          x: 85,
          y: 70,
          w: 10,
          h: 15,
          action: {
            type: "puzzle",
            puzzleId: "puzzle_mecanismo_trava",
            requiresItem: "manivela_bronze",
            requiresFlag: "painel_aberto",
            onSuccess: {
              flag: "trava_destrancada",
              message: "Um ruído mecânico profundo reverbera. A porta da torre se abre!",
              victory: true
            }
          },
          activeIfFlag: "painel_aberto",
          inactiveIfFlag: "trava_destrancada"
        },

        // 10. Drag-and-Place: Piso embaixo do armário (aceita banco)
        {
          id: "banco_drag_target",
          label: "Piso embaixo do Armário",
          x: 75,
          y: 80,
          w: 12,
          h: 8,
          action: {
            type: "drag_place",
            requiredItem: "banquinho_dobravel",
            setFlag: "banco_posicionado",
            successMessage: "Você coloca o banquinho firme no chão, exatamente abaixo da prateleira."
          },
          inactiveIfFlag: "banco_posicionado"
        },

        // 11. Rosa dos Ventos (pista visual para o baú)
        {
          id: "rosa_dos_ventos",
          label: "Rosa dos Ventos",
          x: 50,
          y: 20,
          w: 12,
          h: 15,
          action: {
            type: "message",
            message: "N ⬆️, L ➡️, S ⬇️, O ⬅️. As direções em ordem."
          }
        },

        // 12. Banquinho Coletável (Perto da cama)
        {
          id: "banquinho_pickup",
          label: "Banquinho Dobrável",
          x: 20,
          y: 80,
          w: 8,
          h: 12,
          action: {
            type: "pickup",
            itemId: "banquinho_dobravel",
            flag: "picked_banquinho"
          },
          inactiveIfFlag: "picked_banquinho"
        }
      ]
    }
  }
};
