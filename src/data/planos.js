export const RECURSOS = [
  { nome: 'Todos os editais e o calendário', gratis: true, pro: true, escola: true },
  { nome: 'Resumo semanal por e-mail', gratis: true, pro: true, escola: true },
  {
    nome: 'Alertas no WhatsApp',
    gratis: 'Só prazos finais',
    pro: 'Prazos e retificações na hora',
    escola: 'Prazos e retificações na hora',
  },
  { nome: 'Filtros de cotas e modalidades', gratis: false, pro: true, escola: true },
  { nome: 'Retificações destacadas no PDF', gratis: false, pro: true, escola: true },
  { nome: 'Sem anúncios', gratis: false, pro: true, escola: true },
  { nome: 'Painel da coordenação e relatórios', gratis: false, pro: false, escola: true },
];

export const FAQ = [
  {
    pergunta: 'O Edihub substitui a leitura do edital oficial?',
    resposta:
      'Não. Resumimos prazos e mudanças para você não perder nada, mas a fonte oficial é sempre o edital publicado pela organizadora. Cada aviso traz o link para o documento original.',
  },
  {
    pergunta: 'De onde vêm as informações?',
    resposta:
      'Dos sites das organizadoras, do Diário Oficial e dos comunicados das instituições. Quando sai uma retificação, comparamos com a versão anterior e mostramos exatamente o que mudou.',
  },
  {
    pergunta: 'Posso cancelar o Pro quando quiser?',
    resposta:
      'Sim. No plano mensal o cancelamento vale a partir do mês seguinte. No semestral, você usa até o fim do período já pago.',
  },
  {
    pergunta: 'Como funciona o licenciamento para escolas?',
    resposta:
      'A escola ou cursinho contrata um pacote anual de contas Pro para as turmas e ganha um painel com os editais mais acompanhados e os alunos com prazos próximos.',
  },
  {
    pergunta: 'Quantas mensagens vou receber no WhatsApp?',
    resposta:
      'No máximo uma por prazo e uma por retificação dos editais que você acompanha. Você escolhe a antecedência: 1, 3 ou 7 dias.',
  },
];
