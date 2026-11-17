import { useState } from 'react';
import { Check, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { PLANOS } from '../data/constants.js';
import { FAQ, RECURSOS } from '../data/planos.js';
import { Button } from '../components/ui/Button.jsx';
import { SegmentedControl } from '../components/ui/SegmentedControl.jsx';
import { Accordion } from '../components/ui/Accordion.jsx';
import { CheckoutModal } from '../components/plans/CheckoutModal.jsx';
import { cn } from '../lib/cn.js';

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function Cell({ value }) {
  if (value === true) return <Check className="mx-auto size-4 text-action-strong" aria-label="Incluído" />;
  if (value === false) return <Minus className="mx-auto size-4 text-faint" aria-label="Não incluído" />;
  return <span className="text-xs text-ink-soft">{value}</span>;
}

export default function PlanosPage() {
  const { plan, setPlan, openAlerts } = useApp();
  const { notify } = useToast();
  const [ciclo, setCiclo] = useState('semestral');
  const [checkout, setCheckout] = useState(false);
  const mensalEquivalente = PLANOS.pro.semestral / 6;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">Escolha como acompanhar seus editais</h1>
        <p className="mt-3 text-muted">
          Comece grátis. Passe para o Pro quando quiser aviso na hora em que o edital muda.
        </p>
        <SegmentedControl
          className="mt-6"
          label="Ciclo de cobrança"
          value={ciclo}
          onChange={setCiclo}
          options={[
            { value: 'mensal', label: 'Mensal' },
            { value: 'semestral', label: 'Semestral, economize 33%' },
          ]}
        />
      </header>

      <div className="mt-12 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1fr_1.15fr_1fr]">
        {/* Gratuito */}
        <section className="flex flex-col rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">Gratuito</h2>
          <p className="mt-1 text-sm text-muted">Para conhecer e acompanhar o básico.</p>
          <p className="tabular mt-6 font-serif text-4xl font-semibold text-ink">R$ 0</p>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-soft">
            <li>Todos os editais e o calendário</li>
            <li>Resumo semanal por e-mail</li>
            <li>Lembrete de prazo final no WhatsApp</li>
            <li className="text-muted">Com anúncios</li>
          </ul>
          <Button
            variant="outline"
            className="mt-8"
            onClick={() => {
              if (plan === 'pro') {
                setPlan('free');
                notify('Você voltou para o plano gratuito.', { tone: 'info' });
              } else openAlerts();
            }}
          >
            {plan === 'pro' ? 'Voltar ao gratuito' : 'Começar grátis'}
          </Button>
        </section>

        {/* Pro */}
        <section className="relative flex flex-col rounded-2xl border-2 border-primary bg-navy-950 p-6 shadow-2xl shadow-primary/10">
          <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
            Mais escolhido
          </span>
          <h2 className="text-lg font-semibold text-ink">Pro</h2>
          <p className="mt-1 text-sm text-muted">Para quem não pode perder nenhuma mudança.</p>
          <p className="tabular mt-6 flex flex-wrap items-baseline gap-x-1.5 font-serif text-4xl font-semibold text-ink">
            {brl(PLANOS.pro[ciclo])}
            <span className="font-sans text-base font-normal text-muted">
              /{ciclo === 'mensal' ? 'mês' : 'semestre'}
            </span>
          </p>
          <p className="mt-1 h-5 text-sm text-primary-soft">
            {ciclo === 'semestral' && `Equivale a ${brl(mensalEquivalente)} por mês`}
          </p>
          <ul className="mt-5 flex-1 space-y-2.5 text-sm text-ink">
            {[
              'Retificações no WhatsApp na hora',
              'Filtros de cotas e modalidades',
              'Mudanças destacadas no PDF do edital',
              'Sem anúncios',
            ].map((r) => (
              <li key={r} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-action-strong" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
          {plan === 'pro' ? (
            <Button variant="subtle" className="mt-8" disabled>
              Seu plano atual
            </Button>
          ) : (
            <Button className="mt-8" size="lg" onClick={() => setCheckout(true)}>
              Assinar o Pro
            </Button>
          )}
        </section>

        {/* Escolas */}
        <section className="flex flex-col rounded-2xl border border-line border-t-4 border-t-school bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">Escolas e cursinhos</h2>
          <p className="mt-1 text-sm text-muted">Contas Pro em lote para as turmas de 3º ano e pré-vestibular.</p>
          <p className="mt-6 font-serif text-4xl font-semibold text-school-soft">Licença anual</p>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-soft">
            <li>Tudo do Pro para cada aluno</li>
            <li>Painel da coordenação</li>
            <li>Relatório de interesse por turma</li>
          </ul>
          <Button variant="school" className="mt-8" to="/escolas">
            Ver painel de demonstração
          </Button>
        </section>
      </div>

      <section className="mt-20" aria-labelledby="comparar">
        <h2 id="comparar" className="font-serif text-3xl font-semibold text-ink">
          Compare os planos
        </h2>
        <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-line sm:block">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium text-muted">
                  Recurso
                </th>
                {['Gratuito', 'Pro', 'Escolas'].map((p) => (
                  <th
                    key={p}
                    scope="col"
                    className={cn(
                      'w-44 px-5 py-3 text-center font-semibold',
                      p === 'Pro' ? 'text-primary-mist' : 'text-ink',
                    )}
                  >
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECURSOS.map((r) => (
                <tr key={r.nome} className="border-t border-line">
                  <th scope="row" className="px-5 py-3 text-left font-normal text-ink-soft">
                    {r.nome}
                  </th>
                  <td className="px-5 py-3 text-center">
                    <Cell value={r.gratis} />
                  </td>
                  <td className="bg-primary/[0.05] px-5 py-3 text-center">
                    <Cell value={r.pro} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Cell value={r.escola} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Celular: cada recurso em um bloco, com os três planos lado a lado */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-line sm:hidden">
          <div className="grid grid-cols-3 border-b border-line bg-surface text-center text-xs font-semibold" aria-hidden>
            <span className="px-2 py-2.5 text-ink">Gratuito</span>
            <span className="bg-primary/[0.08] px-2 py-2.5 text-primary-mist">Pro</span>
            <span className="px-2 py-2.5 text-ink">Escolas</span>
          </div>
          <dl className="divide-y divide-line">
            {RECURSOS.map((r) => (
              <div key={r.nome}>
                <dt className="px-4 pt-3 text-sm font-medium text-ink-soft">{r.nome}</dt>
                <dd className="grid grid-cols-3 items-center text-center">
                  {[
                    ['Gratuito', r.gratis],
                    ['Pro', r.pro],
                    ['Escolas', r.escola],
                  ].map(([plano, v]) => (
                    <span key={plano} className={cn('px-2 pt-2 pb-3', plano === 'Pro' && 'bg-primary/[0.08]')}>
                      <span className="sr-only">{plano}: </span>
                      <Cell value={v} />
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl" aria-labelledby="duvidas">
        <h2 id="duvidas" className="mb-6 font-serif text-3xl font-semibold text-ink">
          Dúvidas frequentes
        </h2>
        <Accordion items={FAQ} />
      </section>

      {checkout && <CheckoutModal ciclo={ciclo} onClose={() => setCheckout(false)} />}
    </div>
  );
}
