# Edihub

Plataforma que centraliza e monitora editais e prazos de vestibulares públicos, privados e concursos militares. O aluno acompanha os certames que importam e recebe prazos e retificações no WhatsApp, explicados em uma frase.

> Projeto acadêmico com **dados de demonstração**. As datas são calculadas a partir do dia de hoje para o demo sempre mostrar prazos vivos; taxas, vagas, retificações, anúncios e o painel escolar são ilustrativos.

## Integrantes

| Nome | RM |
| --- | --- |
| Bernardo de Paula Rodrigues | 572376 |
| Arthur Moreira Costa | 571532 |
| Henrique Nunes Mororó | 574073 |

## Ferramentas e tecnologias

### Base do projeto

| Ferramenta | Versão | Para que foi usada |
| --- | --- | --- |
| [React](https://react.dev) + React DOM | 19.3 | Interface em componentes |
| [Vite](https://vite.dev) + `@vitejs/plugin-react` | 8.3 / 6.3 | Servidor de desenvolvimento e build de produção |
| JavaScript (ES2022+) e JSX | — | Linguagem do projeto |
| [React Router](https://reactrouter.com) (`HashRouter`) | 7.18 | Rotas; funciona no GitHub Pages sem configuração extra |
| [Node.js](https://nodejs.org) + npm | 24 / 11 | Ambiente de execução e gerenciador de pacotes |

### Visual e animação

| Ferramenta | Versão | Para que foi usada |
| --- | --- | --- |
| [Tailwind CSS](https://tailwindcss.com) + `@tailwindcss/vite` | 4.3 | Estilos; cores do tema escuro e claro como tokens em `src/index.css` (`@theme`) |
| [GSAP](https://gsap.com) + ScrollTrigger + `@gsap/react` (`useGSAP`) | 3.15 / 2.1 | Entrada do hero, giro do radar, linha de progresso por rolagem, modais e gavetas; respeita `prefers-reduced-motion` |
| Canvas 2D API (nativa do navegador) | — | Mar animado e interativo no hero e rastro de fósforo do radar (decaimento exponencial com gradiente cônico) |
| SVG | — | Radar de prazos, padrão de ícones de fundo e logos |
| [Lucide React](https://lucide.dev) | 1.73 | Ícones |
| [Fontsource](https://fontsource.org): Fraunces e Instrument Sans | 5.3 | Fontes de títulos (serifada) e de texto, servidas localmente |

### APIs do navegador

- **`prefers-color-scheme`**: na primeira visita, o site usa o tema do sistema operacional (claro ou escuro).
- **`localStorage`**: guarda o tema escolhido, os editais acompanhados, os alertas e o plano.
- **`Intl.DateTimeFormat` / `Intl.NumberFormat`**: datas e valores em português do Brasil.
- **`IntersectionObserver`, `ResizeObserver`, `MutationObserver`**: pausam as animações fora da tela e as adaptam ao tamanho e ao tema.

### Desenvolvimento

- **[Visual Studio Code](https://code.visualstudio.com)**: editor.
- **[Prettier](https://prettier.io)**: formatação do código (configuração em `.prettierrc`).
- **[Git](https://git-scm.com) e [GitHub](https://github.com)**: versionamento e hospedagem do código.
- **[Claude Code](https://claude.com/claude-code)**: assistente de IA usado no desenvolvimento e nos testes de layout.

### Imagens e conteúdo

- Logos das instituições: [Wikimedia Commons](https://commons.wikimedia.org) e Wikipédia em português (em `public/logos/`). São marcas dos respectivos donos, usadas aqui só para fins acadêmicos.
- Banners de anúncio e padrão de ícones: criados pelo grupo (em `public/ads/` e `public/patterns/`).

## Como rodar

Pré-requisito: Node.js 20 ou mais recente.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/
npm run preview   # serve o build
```

## Funcionalidades

| Página | O que faz |
| --- | --- |
| **Início** (`/`) | Radar de prazos sobre um mar animado (cada ponto é um edital; quanto mais perto do centro, mais próximo o prazo), feixe com rastro de fósforo, prazos dos próximos 7 dias, passo a passo com linha de progresso e navegação por tipo de certame |
| **Editais** (`/editais`) | Busca, filtros por tipo, situação, UF e área (com contagem por opção), ordenação, grade ou lista. Os filtros ficam na URL, então uma busca pode ser compartilhada |
| **Gaveta do edital** (`?edital=<id>`) | Abre em qualquer página: etapas em linha do tempo, retificações com "antes e agora", informações gerais, documentos e atalho para alertas |
| **Calendário** (`/calendario`) | Grade mensal com eventos por dia, painel do dia selecionado e lista do mês; filtro "só o que acompanho" |
| **Meu radar** (`/radar`) | Editais acompanhados em ordem de urgência, próximos 30 dias e configuração dos alertas |
| **Planos** (`/planos`) | Gratuito, Pro (R$ 14,90/mês ou R$ 59,90/semestre) e licença escolar; checkout simulado que remove os anúncios; tabela comparativa e FAQ |
| **Para escolas** (`/escolas`) | Painel B2B de demonstração: indicadores, interesse por vestibular, alunos que precisam de atenção, turmas e formulário de proposta |

**Recursos globais**

- **Tema claro e escuro**: segue o sistema operacional na primeira visita; o botão do sol ou da lua no topo alterna e salva a escolha. O tema claro usa uma paleta azul com contraste de leitura revisado (WCAG AA).
- **Logos** das 14 instituições, com a sigla colorida como alternativa se a imagem não carregar.
- **Responsivo**: layouts próprios para celular, testados de 320 px até telas grandes.
- **Busca rápida** com **Ctrl/⌘ + K**, central de notificações (retificações e prazos dos editais acompanhados), cadastro de alertas em 3 passos com prévia da mensagem do WhatsApp e avisos com "Desfazer".
- **Anúncio** no plano gratuito: banner que abre um pop-up com a oferta completa.
- **Acessibilidade**: navegação por teclado, foco visível, textos alternativos e animações reduzidas para quem ativa "reduzir movimento" no sistema.

## Estrutura

```
src/
├── main.jsx                 # providers (tema, rotas, avisos, estado) + router
├── App.jsx                  # rotas (páginas internas com lazy loading)
├── index.css                # Tailwind v4 + tokens de cor dos temas escuro e claro
├── components/
│   ├── ui/                  # Button, Badge, Chip, Overlay (Modal/Drawer), Field, Switch, InstitutionMark…
│   ├── layout/              # AppLayout, Navbar, ThemeToggle, NotificationsMenu, CommandPalette, Footer, AdBanner
│   ├── editais/             # EditalCard, EditalRow, EditalDrawer, EtapasTimeline, FiltersPanel…
│   ├── home/                # Hero, OceanBackground, DeadlineRadar, RadarTrail, WeekDeadlines, HowItWorks…
│   ├── calendar/            # MonthGrid, EventList
│   ├── alerts/              # AlertsModal, WhatsAppPreview
│   ├── plans/               # CheckoutModal
│   └── b2b/                 # InterestBars
├── context/                 # AppContext (radar, alertas, plano, notificações), ThemeContext e ToastContext
├── data/                    # editais, constantes, planos, escola (dados de demonstração)
├── hooks/                   # useLocalStorage, useHotkey, useScrollLock, useEditalParam
├── lib/                     # datas pt-BR, regras de status e prazo, filtros, gsap
└── pages/                   # uma página por rota

public/
├── logos/                   # logos das instituições
├── ads/                     # banner e pop-up do anúncio
└── patterns/                # padrão de ícones de fundo (versões para tema claro e escuro)
```
