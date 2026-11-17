import { useState } from 'react';
import { Download, School } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useEditalParam } from '../hooks/useEditalParam.js';
import { ALUNOS_ATENCAO, ESCOLA, INTERESSE, TURMAS } from '../data/escola.js';
import { getEditalById } from '../data/editais.js';
import { getStatus } from '../lib/edital.js';
import { InterestBars } from '../components/b2b/InterestBars.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Field } from '../components/ui/Field.jsx';
import { InstitutionMark } from '../components/ui/InstitutionMark.jsx';

function Kpi({ value, label }) {
  return (
    <div className="bg-surface p-4 sm:p-5">
      <p className="tabular font-serif text-3xl font-semibold text-school-soft sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

export default function EscolasPage() {
  const { editais } = useApp();
  const { notify } = useToast();
  const { openEdital } = useEditalParam();
  const [form, setForm] = useState({ nome: '', escola: '', email: '', alunos: '' });
  const [errors, setErrors] = useState({});

  const abertos = editais.filter((e) => ['aberta', 'isencao'].includes(getStatus(e))).length;

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.nome.trim()) err.nome = 'Informe seu nome.';
    if (!form.escola.trim()) err.escola = 'Informe o nome da escola ou cursinho.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Informe um e-mail válido, ex.: coordenacao@escola.com.br.';
    setErrors(err);
    if (Object.keys(err).length) return;
    notify(`Pedido enviado. Retornamos para ${form.email} em até 2 dias úteis.`);
    setForm({ nome: '', escola: '', email: '', alunos: '' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="school" icon={School}>
            Demonstração
          </Badge>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">Painel da coordenação</h1>
          <p className="mt-2 text-muted">
            Como o {ESCOLA.nome} ({ESCOLA.cidade}) acompanha os vestibulares das turmas.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => notify('Relatório mensal em PDF gerado (simulação).', { tone: 'info' })}
        >
          <Download className="size-4" aria-hidden />
          Baixar relatório do mês
        </Button>
      </header>

      <section
        aria-label="Indicadores"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4"
      >
        <Kpi value={ESCOLA.alunos} label="alunos com conta Pro" />
        <Kpi value={abertos} label="editais com inscrição ou isenção aberta" />
        <Kpi value={ALUNOS_ATENCAO.length} label="alunos que precisam de atenção" />
        <Kpi value={`${ESCOLA.horasPoupadas} h`} label="de pesquisa manual poupadas no mês" />
      </section>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-labelledby="mais-acompanhados">
          <h2 id="mais-acompanhados" className="mb-5 text-lg font-semibold text-ink">
            Vestibulares mais acompanhados
          </h2>
          <InterestBars data={INTERESSE} total={ESCOLA.alunos} />
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-labelledby="atencao">
          <h2 id="atencao" className="mb-3 text-lg font-semibold text-ink">
            Precisam de atenção
          </h2>
          <ul className="divide-y divide-line">
            {ALUNOS_ATENCAO.map((a) => {
              const ed = getEditalById(a.edital);
              return (
                <li key={a.nome}>
                  <button
                    type="button"
                    onClick={() => openEdital(ed.id)}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <InstitutionMark edital={ed} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">
                        {a.nome} <span className="font-normal text-faint">· {a.turma}</span>
                      </span>
                      <span className="block text-sm text-alert-soft">{a.motivo}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface sm:bg-transparent" aria-labelledby="turmas">
        <h2 id="turmas" className="bg-surface px-5 pt-5 pb-3 text-lg font-semibold text-ink">
          Turmas
        </h2>
        <table className="hidden w-full min-w-[560px] text-sm sm:table">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th scope="col" className="px-5 py-2 font-medium">
                Turma
              </th>
              <th scope="col" className="px-5 py-2 font-medium">
                Alunos
              </th>
              <th scope="col" className="px-5 py-2 font-medium">
                Alertas ativos
              </th>
              <th scope="col" className="px-5 py-2 font-medium">
                Área mais procurada
              </th>
            </tr>
          </thead>
          <tbody>
            {TURMAS.map((t) => (
              <tr key={t.id} className="border-t border-line">
                <th scope="row" className="px-5 py-3 text-left font-medium text-ink">
                  {t.nome}
                </th>
                <td className="tabular px-5 py-3 text-ink-soft">{t.alunos}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-3">
                    <span className="h-1.5 w-24 overflow-hidden rounded-full bg-raised">
                      <span
                        className="block h-full rounded-full bg-action"
                        style={{ width: `${t.alertasAtivos * 100}%` }}
                      />
                    </span>
                    <span className="tabular text-ink-soft">{Math.round(t.alertasAtivos * 100)}%</span>
                  </span>
                </td>
                <td className="px-5 py-3 text-ink-soft">{t.area}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Celular: um cartão por turma */}
        <ul className="divide-y divide-line sm:hidden">
          {TURMAS.map((t) => (
            <li key={t.id} className="px-5 py-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-medium text-ink">{t.nome}</p>
                <p className="tabular shrink-0 text-sm text-ink-soft">{t.alunos} alunos</p>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-raised">
                  <span className="block h-full rounded-full bg-action" style={{ width: `${t.alertasAtivos * 100}%` }} />
                </span>
                <span className="tabular shrink-0 text-ink-soft">{Math.round(t.alertasAtivos * 100)}% com alertas</span>
              </div>
              <p className="mt-1 text-xs text-muted">Área mais procurada: {t.area}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mt-16 grid gap-10 rounded-3xl border border-school/30 bg-school/[0.06] p-6 sm:p-10 lg:grid-cols-2"
        aria-labelledby="proposta"
      >
        <div>
          <h2 id="proposta" className="font-serif text-3xl font-semibold text-ink">
            Leve o Edihub para a sua escola
          </h2>
          <p className="mt-3 max-w-md text-muted">
            Licença anual com contas Pro para todas as turmas, painel da coordenação e relatório mensal para as reuniões
            pedagógicas.
          </p>
        </div>
        <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Seu nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            error={errors.nome}
            autoComplete="name"
          />
          <Field
            label="Escola ou cursinho"
            value={form.escola}
            onChange={(e) => setForm({ ...form, escola: e.target.value })}
            error={errors.escola}
            autoComplete="organization"
          />
          <Field
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            autoComplete="email"
          />
          <Field
            label="Número de alunos"
            type="number"
            min="1"
            inputMode="numeric"
            value={form.alunos}
            onChange={(e) => setForm({ ...form, alunos: e.target.value })}
            hint="Aproximado, das turmas de 3º ano e pré."
          />
          <Button type="submit" variant="school" size="lg" className="sm:col-span-2">
            Pedir proposta
          </Button>
        </form>
      </section>
    </div>
  );
}
