# Uso de Inteligência Artificial

A equipe usou IA como **copiloto**, conforme os combinados da Global Solution: para implementar e revisar partes do código, testar o layout e aprender técnicas novas. As decisões de produto, de conteúdo e de visual foram da equipe, e cada pedido abaixo partiu de uma necessidade que identificamos ao usar o próprio site.

## Ferramenta

| Ferramenta | Modelo | Como foi usada |
| --- | --- | --- |
| [Claude Code](https://claude.com/claude-code) (extensão do VS Code) | Claude Opus 5.5 | Edição de código no repositório, testes visuais automatizados no navegador (capturas de tela no celular e no computador, nos dois temas) e revisão de contraste e de responsividade |

## Registro dos pedidos (prompts)

Pedidos feitos pela equipe nesta etapa do projeto, em ordem, com o que mudou no código.

| # | Pedido da equipe | O que foi feito | Onde |
| --- | --- | --- | --- |
| 1 | "Quero que seja incluído as logos de cada vestibular" | Logos das 14 instituições, com a sigla colorida como alternativa se a imagem falhar | `InstitutionMark.jsx`, `public/logos/`, `data/editais.js` |
| 2 | "Melhore o meu header deixando a logo na esquerda, as páginas de navegação no centro e a lupa e a notificação na direita" | Header em 3 colunas | `Navbar.jsx` |
| 3 | "Quero que fique mais igual ao layout do YouTube, que a logo fique bem na extremidade da esquerda" | Header com largura total | `Navbar.jsx` |
| 4 | "Quero que implemente a opção light (…) porém detecção automática do sistema operacional seja a pré-setada (…) nada fique ilegível e nem feio" | Tema claro com cores em variáveis CSS, detecção do tema do sistema e revisão de contraste | `index.css`, `ThemeContext.jsx`, `index.html` |
| 5 | "No tema claro, não quero que tudo fique branco, mas sim uma paleta de cores no azul (…) não quero uma opção de sistema (…) quando o usuário abre o site pela primeira vez, o navegador verifica se o Windows está no tema claro ou escuro" | Paleta azul no tema claro; botão simples claro/escuro; tema do sistema só na primeira visita | `index.css`, `ThemeToggle.jsx`, `ThemeContext.jsx` |
| 6 | "Ainda acho que o modo light está muito branco (…) reformule as cores (…) usando mais cores claras como o azul" | Fundos em azul claro, com textos mais escuros para manter o contraste | `index.css` |
| 7 | "Mude essa parte do site no light mode (…) tirando todo o contraste de cor escura com cor clara" | Chamada final ("Comece grátis") em azul claro no tema claro | `FinalCta.jsx`, `index.css` |
| 8 | "Quero que o hover dos botões no light mode fique mais destacado" | Cores próprias para o hover, aplicadas em 13 componentes | `index.css`, `Button.jsx`, `Navbar.jsx` e outros |
| 9 | "Quero que nessa parte inicial tenha um fundo que pareça que a bússola está no meio do mar (…) quando passe o mouse tenha uma interação com o fundo" | Mar animado em canvas, com ondas que reagem ao mouse e ao clique | `OceanBackground.jsx`, `Hero.jsx` |
| 10 | "No lugar do anúncio coloque uma imagem que realmente pareça um anúncio" | Banner de anúncio com imagem | `AdBanner.jsx`, `public/ads/` |
| 11 | "Use esse anúncio, porém recorte para ficar certinho no site" | Recorte e otimização da imagem enviada pela equipe | `public/ads/` |
| 12 | "Quero que quando aperte este anúncio o seguinte pop-up abra" | Pop-up com a oferta completa | `AdBanner.jsx` |
| 13 | "Melhore a responsividade do site para o mobile" | Layout de celular revisado em todas as páginas, testado de 320 px a 1440 px | Vários componentes e páginas |
| 14 | "A animação do radar, toda vez que completa 1 volta, para por alguns segundos (…) quero que o radar não pare de rodar nunca" | Giro do radar separado do brilho dos pontos, para não travar a cada volta | `Hero.jsx` |
| 15 | "O rastro do radar parece só uma foto PNG estática (…) quero que pareça que tem física" | Rastro com decaimento exponencial, como o fósforo de um radar real | `RadarTrail.jsx`, `DeadlineRadar.jsx` |
| 16 | "Nessa parte use um fundo com ícones assim como o anexado" | Padrão de ícones criado pela equipe aplicado ao fundo, com versão para o tema escuro | `HowItWorks.jsx`, `public/patterns/` |
| 17 | "Tire as bolinhas do rastro do radar. De resto mantenha" | Remoção dos pontinhos do rastro | `RadarTrail.jsx` |
| 18 | "Publique isso no meu GitHub colocando o README com todas as ferramentas que eu usei e os integrantes" | Repositório Git, README, Integrantes e este arquivo | `README.md`, `Integrantes.md`, `AI.md` |
| 19 | "Faça a parte da integração com API externa para o CRUD" | Lembretes do estudante salvos no MockAPI (criar, listar, editar, marcar como feito, excluir e desfazer), com camadas separadas, custom hook, validação e tratamento de erros; testado de ponta a ponta com um servidor local que imita o MockAPI | `src/services/`, `src/lib/lembretes.js`, `src/context/LembretesContext.jsx`, `src/hooks/useLembretes.js`, `src/components/lembretes/` |

## O que a equipe conferiu

- Cada mudança foi testada no navegador antes de seguir para a próxima, nos temas claro e escuro e no celular.
- O código gerado foi lido e ajustado pela equipe; os comentários em português explicam o porquê de cada decisão.
- Nenhum dado pessoal real foi enviado à IA: os dados do projeto são simulados.
