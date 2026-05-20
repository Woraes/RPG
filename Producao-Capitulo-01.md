# Plano de Produção - Capítulo 01

## Estado Atual
- ✅ GDD estruturado ([Capitulo-01-GDD.md](Capitulo-01-GDD.md))
- ✅ Assets mapeados ([Capitulo-01-Assets.md](Capitulo-01-Assets.md))
- ✅ Items, Puzzles e Hotspots integrados em [story.js](story.js)
- ✅ Game.html, engine.js e app-pages.js funcional

## O que falta
Gerar as imagens (assets) indicadas abaixo. Depois disso, o capítulo funcionará completo.

---

## Lista de Geração de Imagens

### Prioridade 1 (Essencial para jogar)

| Arquivo | Tipo | Dimensões | Descrição | Uso |
|---------|------|-----------|-----------|-----|
| `casa_farol_principal.png` | Fundo | 1920x1080 | Casa de farol após tempestade com todos os objetos | Cena principal |
| `painel_mecanismo.png` | UI/Puzzle | 1200x900 | Interface do mini-game mecânico com trilhas e discos | Mini-game da trava |

### Prioridade 2 (Qualidade visual do jogo)

| Arquivo | Tipo | Dimensões | Descrição | Uso |
|---------|------|-----------|-----------|-----|
| `baú_marítimo_closed.png` | Close-up | 1200x800 | Baú fechado em close-up | Cena dedicada (antes) |
| `baú_marítimo_open.png` | Close-up | 1200x800 | Baú aberto em close-up | Overlay após puzzle |
| `armário_alto_vazio.png` | Close-up | 1000x900 | Topo do armário com frasco de óleo | Close-up do armário |
| `estante_livros_closeup.png` | Close-up | 1000x900 | Estante de livros com detalhe | Close-up da estante |
| `mesa_trabalho_closeup.png` | Close-up | 1100x850 | Mesa com ferramentas e mapa | Close-up da mesa |

### Prioridade 3 (Ícones do inventário)

| Arquivo | Tipo | Dimensões | Descrição | Uso |
|---------|------|-----------|-----------|-----|
| `itens/banquinho_dobravel.png` | Sprite | 128x128 | Ícone do banquinho | Inventário |
| `itens/chave_fenda_enferrujada.png` | Sprite | 128x128 | Ícone da chave de fenda | Inventário |
| `itens/mapa_costa.png` | Sprite | 128x128 | Ícone do mapa | Inventário |
| `itens/frasco_oleo.png` | Sprite | 128x128 | Ícone do frasco de óleo | Inventário |
| `itens/manivela_bronze.png` | Sprite | 128x128 | Ícone da manivela | Inventário |

---

## Estrutura de Pastas Esperada

```
assets/images/
├── casa_farol_principal.png
├── baú_marítimo_closed.png
├── baú_marítimo_open.png
├── armário_alto_vazio.png
├── estante_livros_closeup.png
├── mesa_trabalho_closeup.png
├── painel_mecanismo.png
├── scenes/
│   └── (close-ups normalizados pelo engine)
└── itens/
    ├── banquinho_dobravel.png
    ├── chave_fenda_enferrujada.png
    ├── mapa_costa.png
    ├── frasco_oleo.png
    └── manivela_bronze.png
```

---

## Próximos Passos

### 1. Gerar Imagens (You / IA de Imagem)
Use os prompts em [Capitulo-01-Assets.md](Capitulo-01-Assets.md) seção 6 para gerar cada imagem.

### 2. Organizar Arquivos
Salve as imagens na pasta correta (`assets/images/` e `assets/images/itens/`).

### 3. Testar o Jogo
```bash
docker compose restart
```
Acesse http://localhost:8080 e teste o fluxo completo:
1. Login
2. Clique em "A Chave do Faroleiro"
3. Explore a sala, colete itens, resolva puzzles

### 4. Ajustar Hotspots (se necessário)
Se as posições dos hotspots não corresponderem visualmente aos objetos, edite as coordenadas em `story.js` na seção de `hotspots`.

---

## Checklist Técnico

- [x] Metadados do capítulo definidos
- [x] 5 itens do inventário estruturados
- [x] 2 puzzles principais coded
- [x] 11 hotspots mapeados
- [x] Flags de estado definidas
- [x] Integration com engine.js validada
- [ ] Imagens geradas (fundo + close-ups + UI)
- [ ] Sprites do inventário gerados
- [ ] Teste end-to-end completo
- [ ] Ajustes visuais (se necessário)

---

## Gancho para Capítulo 2

Ao subir a escada da torre, Liora encontra a sala da lanterna parcialmente destruída. A luz foi sabotada de dentro para fora, e há marcas molhadas no metal, como se alguém tivesse subido à torre carregando algo vindo do mar. Esse é o gancho narrativo que abre o próximo capítulo.

---

*Última atualização: 20/05/2026*
