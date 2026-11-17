# Edihub

Plataforma que reúne editais e prazos de vestibulares públicos, privados e concursos militares. O estudante acompanha os que importam para ele e recebe avisos de prazos e retificações explicados em uma frase, sem precisar ler um PDF de 80 páginas.

> **Global Solution 2026.2 · Desafio CitizenTech · FIAP · Engenharia de Software, 1º ano · Rio de Janeiro**
> Este repositório é a parte de **Interface (Front-end Design)** e de **Interação (Web Development)** da CitizenTech da equipe.

**🌐 Site no ar: [edihub-gs.vercel.app](https://edihub-gs.vercel.app)**

## Ficha da CitizenTech

| | |
| --- | --- |
| **Nome da CitizenTech** | Edihub |
| **Cidade e bairro** | Rio de Janeiro, RJ |
| **Cidadão beneficiado** | Estudante do ensino médio ou do pré-vestibular, principalmente da rede pública, que presta mais de um vestibular ou concurso e não tem quem acompanhe os editais por ele |
| **Problema, em uma frase** | Os prazos de inscrição, de pedido de isenção da taxa e as retificações ficam espalhados em editais longos de várias instituições, e o estudante perde datas importantes, às vezes a chance de fazer a prova de graça, por falta de informação no momento certo |
| **Como funciona** | O Edihub monitora os editais e mostra, num só lugar, a situação de cada um e os próximos prazos. O estudante marca os vestibulares que quer acompanhar, vê tudo em um radar e em um calendário e ativa avisos que explicam, em linguagem simples, o que mudou e o que ele precisa fazer |
| **O que cada parte faz** | **Interface (Front-end Design):** páginas em React onde o estudante vê editais, prazos, calendário e radar, com layout para celular e tema claro/escuro. **Interação (Web Development):** as funcionalidades em JavaScript: acompanhar editais, filtros e busca, alternar o tema, cadastro de alertas, notificações e anúncio com pop-up. As demais disciplinas da GS são entregues em suas próprias tarefas |
| **Link do repositório** | https://github.com/Arthur-Moreira95/Edihub-GS |
| **Site publicado** | https://edihub-gs.vercel.app (hospedado na Vercel, com deploy automático a cada push na `main`) |
| **Indicador de impacto** | Quantidade de prazos de inscrição e de isenção cumpridos pelos estudantes que acompanham editais no Edihub, comparada aos prazos perdidos. Meta: nenhum prazo perdido por falta de aviso entre quem ativou os alertas |
| **ODS conectados** | **ODS 4 – Educação de qualidade:** facilita o acesso ao ensino superior ao garantir que o estudante saiba quando e como se inscrever. **ODS 10 – Redução das desigualdades:** quem não tem cursinho, família ou escola acompanhando editais passa a ter a mesma informação de quem tem, incluindo os prazos de isenção da taxa |

## Integrantes

| Nome | RM |
| --- | --- |
| Bernardo de Paula Rodrigues | 572376 |
| Arthur Moreira Costa | 571532 |
| Henrique Nunes Mororó | 574073 |

Também em [docs/Integrantes.md](docs/Integrantes.md). O uso de IA no projeto está registrado em [docs/AI.md](docs/AI.md).

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 20 ou mais recente.

```bash
npm install
npm run dev       # abre em http://localhost:5173
npm run build     # gera a versão de produção em dist/
npm run preview   # serve a versão de produção
```

O endereço da API externa já está no arquivo [`.env`](.env) (modelo em [`.env.example`](.env.example)). Sem ele, o site funciona normalmente e o painel de lembretes avisa que a API não foi configurada.

## Integração com API externa (CRUD)

Os **lembretes do estudante** ficam salvos numa API REST externa, o [MockAPI.io](https://mockapi.io), no endereço `https://6afbb37d892984c4494a200e.mockapi.io/lembrete`. São as tarefas que ele anota para cada edital, como "Separar documentos para a isenção da UERJ, até 20/11". O painel aparece em **Meu radar** (todos os lembretes) e na **ficha de cada edital** (só os daquele edital).

| Operação | Requisição | Na tela |
| --- | --- | --- |
| **Create** | `POST /lembrete` | Formulário "O que você precisa fazer?" |
| **Read** | `GET /lembrete?dono=<id>` | Lista carregada ao abrir o painel, ordenada (pendentes primeiro, por data) |
| **Update** | `PUT /lembrete/:id` | Marcar como feito e editar texto, edital ou data |
| **Delete** | `DELETE /lembrete/:id` | Botão da lixeira, com "Desfazer" (que recria o lembrete com um novo `POST`) |

Formato de um lembrete: `{ id, dono, editalId, titulo, data: "AAAA-MM-DD", feito, criadoEm }`. O campo `dono` é um identificador aleatório do navegador, gerado na primeira visita: cada visitante vê só os próprios lembretes, e nenhum dado pessoal é enviado.

**Experiência do estudante**
- **Resposta na hora:** a mudança aparece na tela antes de a API responder. Se a API falhar, a tela volta ao que era e mostra o motivo em português.
- **Validação antes de enviar:** título de 3 a 80 letras, data válida (hoje ou futura ao criar) e edital escolhido.
- **Rede ruim:** tempo limite de 10 segundos, mensagens claras para falta de conexão, servidor fora do ar e excesso de requisições, e botão "Tentar de novo".

**Como o código está separado**

| Camada | Arquivo | Responsabilidade |
| --- | --- | --- |
| Acesso aos dados | [`services/apiClient.js`](src/services/apiClient.js) | `fetch` com tempo limite, tratamento de erro HTTP e endereço vindo do `.env` |
| Acesso aos dados | [`services/lembretesService.js`](src/services/lembretesService.js) | As quatro operações do CRUD no recurso `/lembrete` |
| Regras de negócio | [`lib/lembretes.js`](src/lib/lembretes.js) | Validação, situação (atrasado, hoje, em breve, feito) e ordenação |
| Estado | [`context/LembretesContext.jsx`](src/context/LembretesContext.jsx) | Lista compartilhada entre as telas e atualização otimista com reversão |
| Custom hook | [`hooks/useLembretes.js`](src/hooks/useLembretes.js) | Dispara a busca e entrega a lista filtrada e as operações para os componentes |
| Apresentação | [`components/lembretes/`](src/components/lembretes/) | `LembretesPanel`, `LembreteForm` (criar e editar) e `LembreteItem` |

**Configuração**

O projeto já vem configurado: o arquivo [`.env`](.env) aponta para o MockAPI da equipe, então é só rodar `npm install` e `npm run dev`. O endereço não é segredo, porque o MockAPI é público e só guarda lembretes anônimos.

Para usar outro projeto do MockAPI:
1. Crie um projeto gratuito em [mockapi.io](https://mockapi.io).
2. Crie o recurso **`lembrete`** com os campos `dono` (String), `editalId` (String), `titulo` (String), `data` (String), `feito` (Boolean) e `criadoEm` (Date).
3. Troque o endereço no `.env`: `VITE_API_URL=https://<id>.mockapi.io` (sem barra no final).

**Como foi testado:** um teste automatizado no navegador passou por todo o fluxo contra o MockAPI real, em 18 verificações: criar, listar, editar, marcar como feito, excluir, desfazer, persistência após recarregar, filtro por edital, lista compartilhada entre as telas, validação, erro 500 com reversão, acentos e limpeza dos registros de teste.

## Funcionalidades

| Página | O que o estudante faz |
| --- | --- |
| **Início** (`/`) | Vê um radar de prazos sobre um mar animado: cada ponto é um edital, e quanto mais perto do centro, mais perto o prazo. Abaixo, os prazos dos próximos 7 dias, o passo a passo do serviço e os editais por tipo de prova |
| **Editais** (`/editais`) | Busca por nome, sigla ou cidade; filtra por tipo, situação, estado e área; ordena; alterna entre grade e lista. Os filtros ficam no endereço da página, então uma busca pode ser compartilhada |
| **Ficha do edital** (`?edital=<id>`) | Abre em qualquer página: etapas em linha do tempo, retificações com "antes e agora", informações gerais, documentos e atalho para os alertas |
| **Calendário** (`/calendario`) | Grade do mês com os eventos de cada dia, painel do dia escolhido e lista do mês, com filtro "só o que acompanho" |
| **Meu radar** (`/radar`) | Editais acompanhados em ordem de urgência, próximos 30 dias e configuração dos alertas |
| **Planos** (`/planos`) | Gratuito, Pro (R$ 14,90/mês ou R$ 59,90/semestre) e licença escolar; pagamento simulado que remove os anúncios; tabela comparativa e perguntas frequentes |
| **Para escolas** (`/escolas`) | Painel de demonstração para a coordenação: indicadores, interesse por vestibular, alunos que precisam de atenção, turmas e pedido de proposta |

## Interações em JavaScript (Web Development)

| Interação | O que acontece | Onde está o código |
| --- | --- | --- |
| **Modo claro e escuro** | Na primeira visita, o site lê o tema do sistema operacional (Windows, macOS, celular) e aplica as cores certas antes de a página aparecer. O botão do sol ou da lua no topo alterna o tema e salva a escolha no navegador | [`ThemeContext.jsx`](src/context/ThemeContext.jsx), [`ThemeToggle.jsx`](src/components/layout/ThemeToggle.jsx), script em [`index.html`](index.html), cores em [`index.css`](src/index.css) |
| **Acompanhar um edital** | O sino em cada edital adiciona ou remove o vestibular do "Meu radar", com aviso de confirmação e opção de desfazer | [`FollowButton.jsx`](src/components/editais/FollowButton.jsx), [`AppContext.jsx`](src/context/AppContext.jsx) |
| **Busca e filtros** | A lista de editais muda na hora conforme o texto digitado e os filtros escolhidos, com a contagem de resultados por opção | [`EditaisPage.jsx`](src/pages/EditaisPage.jsx), [`filters.js`](src/lib/filters.js) |
| **Busca rápida (Ctrl/⌘ + K)** | Abre uma busca por cima de qualquer página e leva direto ao edital | [`CommandPalette.jsx`](src/components/layout/CommandPalette.jsx), [`useHotkey.js`](src/hooks/useHotkey.js) |
| **Cadastro de alertas** | Formulário em 3 passos, com validação dos campos e prévia da mensagem que chegaria no WhatsApp | [`AlertsModal.jsx`](src/components/alerts/AlertsModal.jsx) |
| **Notificações** | O sino do topo lista retificações e prazos dos editais acompanhados; marcar como lida atualiza o contador | [`NotificationsMenu.jsx`](src/components/layout/NotificationsMenu.jsx) |
| **Mar e radar interativos** | O mouse deixa ondas na água do topo da página; o feixe do radar gira sem parar e acende cada edital ao passar | [`OceanBackground.jsx`](src/components/home/OceanBackground.jsx), [`RadarTrail.jsx`](src/components/home/RadarTrail.jsx), [`Hero.jsx`](src/components/home/Hero.jsx) |
| **Anúncio com pop-up** | Clicar no banner do plano gratuito abre a oferta completa em uma janela | [`AdBanner.jsx`](src/components/layout/AdBanner.jsx) |
| **Lembretes (CRUD na API)** | Criar, marcar como feito, editar e excluir lembretes, salvos na API externa | [`LembretesPanel.jsx`](src/components/lembretes/LembretesPanel.jsx) e [seção do CRUD](#integração-com-api-externa-crud) |

## Como o código está organizado (Front-end Design)

O código separa **dados**, **regras** e **telas**:

| Camada | Pasta | O que tem |
| --- | --- | --- |
| Dados | [`src/data/`](src/data/) | Editais, planos e escola (dados simulados) |
| Acesso à API externa | [`src/services/`](src/services/) | Cliente HTTP e CRUD dos lembretes ([detalhes](#integração-com-api-externa-crud)) |
| Regras de negócio | [`src/lib/`](src/lib/) | Situação de cada edital, próximo prazo, filtros, datas em português |
| Estado | [`src/context/`](src/context/), [`src/hooks/`](src/hooks/) | O que o estudante acompanha, alertas, plano, tema e avisos (guardados no navegador) e os lembretes (na API externa) |
| Apresentação | [`src/components/`](src/components/), [`src/pages/`](src/pages/) | Componentes reutilizáveis e uma página por rota |

**Hooks do React usados:** `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext` e `useId`.

**Hooks próprios (custom hooks):**

| Hook | Para que serve |
| --- | --- |
| `useLocalStorage` | `useState` que salva o valor no navegador (editais acompanhados, alertas, plano, notificações lidas) |
| `useEditalParam` | Abre e fecha a ficha do edital pelo endereço da página (`?edital=`) |
| `useHotkey` | Atalhos de teclado, como Ctrl/⌘ + K |
| `useScrollLock` | Trava a rolagem da página quando um modal está aberto |
| `useTheme` | Lê e troca o tema claro ou escuro |
| `useApp` | Acesso ao estado do Edihub: editais, radar, alertas, plano e notificações |
| `useToast` | Mostra avisos rápidos na tela, com "Desfazer" |
| `useLembretes` | CRUD dos lembretes na API externa: lista filtrada por edital, carregamento, erro e as operações |

```
src/
├── main.jsx                 # providers (tema, rotas, avisos, estado) + router
├── App.jsx                  # rotas (páginas internas carregadas sob demanda)
├── index.css                # Tailwind + cores dos temas escuro e claro
├── components/
│   ├── ui/                  # Button, Badge, Chip, Modal/Drawer, Field, Switch, InstitutionMark…
│   ├── layout/              # Navbar, ThemeToggle, NotificationsMenu, CommandPalette, Footer, AdBanner
│   ├── editais/             # EditalCard, EditalRow, EditalDrawer, EtapasTimeline, FiltersPanel…
│   ├── home/                # Hero, OceanBackground, DeadlineRadar, RadarTrail, WeekDeadlines, HowItWorks…
│   ├── calendar/            # MonthGrid, EventList
│   ├── alerts/              # AlertsModal, WhatsAppPreview
│   ├── plans/               # CheckoutModal
│   ├── lembretes/           # LembretesPanel, LembreteForm, LembreteItem (CRUD)
│   └── b2b/                 # InterestBars
├── context/                 # AppContext, ThemeContext, ToastContext, LembretesContext
├── data/                    # dados simulados
├── services/                # acesso à API externa (apiClient, lembretesService)
├── hooks/                   # hooks próprios
├── lib/                     # regras de negócio
└── pages/                   # uma página por rota

public/
├── logos/                   # logos das instituições
├── ads/                     # banner e pop-up do anúncio
└── patterns/                # padrão de ícones de fundo (tema claro e escuro)

docs/
├── AI.md                    # registro do uso de IA (prompts)
└── Integrantes.md           # nomes e RMs da equipe
```

## Ferramentas e tecnologias

| Ferramenta | Versão | Para que foi usada |
| --- | --- | --- |
| [React](https://react.dev) + React DOM | 19.3 | Interface em componentes e hooks |
| [Vite](https://vite.dev) + `@vitejs/plugin-react` | 8.3 / 6.3 | Servidor de desenvolvimento e versão de produção |
| JavaScript (ES2022+) e JSX | — | Linguagem do projeto |
| [React Router](https://reactrouter.com) | 7.18 | Navegação entre páginas (`HashRouter`, funciona no GitHub Pages) |
| [Tailwind CSS](https://tailwindcss.com) | 4.3 | Estilos; cores dos dois temas definidas como variáveis em `src/index.css` |
| [GSAP](https://gsap.com) + ScrollTrigger + `@gsap/react` | 3.15 / 2.1 | Animações (entrada da página, radar, rolagem, modais), respeitando quem pede menos movimento |
| Canvas 2D e SVG (nativos do navegador) | — | Mar animado, rastro do radar, radar de prazos e padrão de ícones |
| [Lucide React](https://lucide.dev) | 1.73 | Ícones |
| [Fontsource](https://fontsource.org): Fraunces e Instrument Sans | 5.3 | Fontes, servidas pelo próprio site |
| [MockAPI.io](https://mockapi.io) | — | API REST externa onde ficam os lembretes (CRUD) |
| APIs do navegador | — | `fetch` (chamadas à API), `localStorage` (dados salvos), `prefers-color-scheme` (tema do sistema), `Intl` (datas e valores em pt-BR), `IntersectionObserver` e `ResizeObserver` (pausam animações fora da tela) |
| [Node.js](https://nodejs.org) + npm | 24 / 11 | Ambiente e pacotes |
| [Visual Studio Code](https://code.visualstudio.com) e [Prettier](https://prettier.io) | — | Editor e formatação do código |
| [Git](https://git-scm.com) e [GitHub](https://github.com) | — | Versionamento do código |
| [Vercel](https://vercel.com) | — | Hospedagem do site, com deploy automático a cada push |
| [Claude Code](https://claude.com/claude-code) | — | Assistente de IA: detalhes em [docs/AI.md](docs/AI.md) |

## Acessibilidade e uso real

- **Celular primeiro:** layouts próprios para telas pequenas, testados de 320 px até telas grandes, sem rolagem lateral.
- **Contraste:** textos com contraste mínimo de 4,5:1 nos dois temas (padrão WCAG AA).
- **Teclado:** tudo funciona sem mouse, com foco visível.
- **Movimento:** quem ativa "reduzir movimento" no sistema vê a página sem animações.
- **Linguagem simples:** prazos como "Amanhã" ou "5 dias", e retificações explicadas como "antes e agora".

## Dados e fontes

- **Lembretes:** ficam no MockAPI, ligados só a um identificador aleatório do navegador, sem nome, e-mail ou telefone.
- **Dados simulados:** os editais, as datas, as taxas, as retificações, os anúncios e o painel escolar foram criados pela equipe para o protótipo. As datas são calculadas a partir do dia atual, para a demonstração sempre mostrar prazos reais. Nenhum dado pessoal real é usado: os nomes de alunos do painel escolar são fictícios.
- **Logos:** vêm do [Wikimedia Commons](https://commons.wikimedia.org) e da Wikipédia em português (em `public/logos/`). São marcas das respectivas instituições, usadas só para fins acadêmicos.
- **Banners e padrão de ícones:** criados pela equipe (em `public/ads/` e `public/patterns/`). As marcas dos anúncios são fictícias.

## Licença

[MIT](LICENSE).
