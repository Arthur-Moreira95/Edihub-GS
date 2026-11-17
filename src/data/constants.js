export const CATEGORIAS = {
  estadual: { label: 'Estaduais', singular: 'Estadual', descricao: 'UERJ, Fuvest, Unicamp' },
  federal: { label: 'Federais e ENEM', singular: 'Federal', descricao: 'ENEM, SiSU e universidades federais' },
  particular: { label: 'Particulares', singular: 'Particular', descricao: 'PUC-Rio, Mackenzie, Insper' },
  militar: { label: 'Militares', singular: 'Militar', descricao: 'EsPCEx, IME, ITA, AFA, Colégio Naval' },
};

export const STATUS = {
  aberta: { label: 'Inscrições abertas', tone: 'action' },
  isencao: { label: 'Isenção aberta', tone: 'alert' },
  'em-breve': { label: 'Inscrições em breve', tone: 'primary' },
  andamento: { label: 'Inscrições encerradas', tone: 'neutral' },
  aguardando: { label: 'Aguardando edital', tone: 'outline' },
  encerrado: { label: 'Encerrado', tone: 'neutral' },
};

export const ETAPAS = {
  isencao: 'Pedido de isenção',
  inscricao: 'Inscrições',
  homologacao: 'Homologação das inscrições',
  cartao: 'Cartão de confirmação',
  prova: 'Prova',
  resultado: 'Resultado',
  matricula: 'Matrícula',
};

export const AREAS = ['Medicina', 'Engenharias', 'Direito', 'Militares', 'Humanas', 'Saúde', 'Computação', 'Negócios'];

export const UFS = { RJ: 'Rio de Janeiro', SP: 'São Paulo', BR: 'Nacional' };

export const ORDENACAO = {
  prazo: 'Prazo mais próximo',
  seguidores: 'Mais acompanhados',
  taxa: 'Menor taxa',
  nome: 'Nome (A–Z)',
};

export const PLANOS = {
  pro: { mensal: 14.9, semestral: 59.9 },
};

export function formatBRL(valor) {
  if (valor === 0) return 'Isento';
  if (valor == null) return 'A definir';
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatNumber(n) {
  return n.toLocaleString('pt-BR');
}
