/** Dados de demonstração do painel B2B (escola fictícia). */
export const ESCOLA = {
  nome: 'Colégio Horizonte',
  cidade: 'Rio de Janeiro, RJ',
  alunos: 180,
  horasPoupadas: 34,
};

export const TURMAS = [
  { id: '3a', nome: '3º ano A', alunos: 42, alertasAtivos: 0.93, area: 'Medicina' },
  { id: '3b', nome: '3º ano B', alunos: 40, alertasAtivos: 0.85, area: 'Engenharias' },
  { id: '3c', nome: '3º ano C', alunos: 38, alertasAtivos: 0.71, area: 'Direito' },
  { id: 'pre', nome: 'Pré-vestibular noturno', alunos: 34, alertasAtivos: 0.97, area: 'Militares' },
  { id: 'mil', nome: 'Turma preparatória militar', alunos: 26, alertasAtivos: 1, area: 'Militares' },
];

/** Quantos alunos da escola acompanham cada edital. */
export const INTERESSE = {
  'enem-2026': 168,
  'uerj-2027': 131,
  'ufrj-sisu-2027': 104,
  'puc-rio-2027-1': 47,
  'espcex-2027': 39,
  'ime-2027': 28,
  'colegio-naval-2027': 21,
  'ita-2027': 18,
};

export const ALUNOS_ATENCAO = [
  { nome: 'Beatriz S.', turma: '3º ano A', edital: 'uerj-2027', motivo: 'Inscrição não confirmada' },
  { nome: 'Lucas M.', turma: 'Preparatória militar', edital: 'colegio-naval-2027', motivo: 'Isenção vence amanhã' },
  { nome: 'Rafaela T.', turma: '3º ano B', edital: 'puc-rio-2027-1', motivo: 'Pediu bolsa, falta documento' },
  {
    nome: 'João P.',
    turma: 'Pré-vestibular noturno',
    edital: 'espcex-2027',
    motivo: 'Cartão de confirmação sai em 2 dias',
  },
];
