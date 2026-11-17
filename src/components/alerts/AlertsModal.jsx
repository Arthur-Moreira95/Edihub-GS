import { useMemo, useRef, useState } from 'react';
import { Mail, MessageCircle, PartyPopper } from 'lucide-react';
import { AREAS } from '../../data/constants.js';
import { getEditalById } from '../../data/editais.js';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { gsap, useGSAP } from '../../lib/gsap.js';
import { cn } from '../../lib/cn.js';
import { Modal } from '../ui/Overlay.jsx';
import { Field } from '../ui/Field.jsx';
import { Chip } from '../ui/Chip.jsx';
import { Switch } from '../ui/Switch.jsx';
import { Button } from '../ui/Button.jsx';
import { SegmentedControl } from '../ui/SegmentedControl.jsx';
import { WhatsAppPreview } from './WhatsAppPreview.jsx';

const PASSOS = ['Contato', 'Preferências', 'Pronto'];

function maskPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function AlertsModal() {
  const { alertsModal, closeAlerts, prefs, saveAlerts, followed } = useApp();
  const { notify } = useToast();
  const edital = alertsModal.editalId ? getEditalById(alertsModal.editalId) : null;
  const previewEdital = edital ?? getEditalById(followed[0]);

  const [passo, setPasso] = useState(0);
  const [form, setForm] = useState(() => ({
    nome: prefs.nome,
    whatsapp: prefs.whatsapp,
    email: prefs.email,
    areas: prefs.areas.length ? prefs.areas : ['Militares'],
    canais: prefs.canais,
    antecedencia: prefs.antecedencia,
  }));
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const stepRef = useRef(null);

  // Transição entre passos em resposta ao clique em Continuar / Voltar
  useGSAP(
    () => {
      gsap.from(stepRef.current, { x: 24, autoAlpha: 0, duration: 0.35 });
    },
    { dependencies: [passo], revertOnUpdate: true },
  );

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggleArea = (area) =>
    set(
      'areas',
      form.areas.includes(area)
        ? form.areas.filter((a) => a !== area)
        : form.areas.length < 3
          ? [...form.areas, area]
          : form.areas,
    );

  const validateContato = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Informe seu nome.';
    if (form.whatsapp.replace(/\D/g, '').length < 11) e.whatsapp = 'Informe o WhatsApp com DDD, ex.: (21) 98765-4321.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Confira o e-mail: falta o @ ou o domínio.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePrefs = () => {
    const e = {};
    if (!form.canais.whatsapp && !form.canais.email) e.canais = 'Escolha pelo menos um canal para receber os alertas.';
    if (form.canais.email && !form.email) e.canais = 'Para o resumo por e-mail, volte e informe seu e-mail.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (passo === 0) {
      if (!validateContato()) return;
      // sem e-mail informado, o resumo semanal começa desligado
      if (!form.email.trim()) set('canais', { ...form.canais, email: false });
    }
    if (passo === 1) {
      if (!validatePrefs()) return;
      saveAlerts(form, edital?.id);
      notify(`Alertas ativados para ${form.nome.trim().split(' ')[0]}.`);
    }
    setPasso((p) => p + 1);
  };

  const resumoCanais = useMemo(() => {
    const c = [];
    if (form.canais.whatsapp) c.push('no WhatsApp');
    if (form.canais.email) c.push('por e-mail');
    return c.join(' e ');
  }, [form.canais]);

  return (
    <Modal onClose={closeAlerts} label="Ativar alertas" initialFocus={nameRef}>
      {({ close }) => (
        <div className="overflow-y-auto">
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            <div className="p-6 sm:p-8">
              <ol className="mb-6 flex items-center gap-2 text-xs" aria-label="Progresso">
                {PASSOS.map((p, i) => (
                  <li key={p} className="flex items-center gap-2">
                    <span
                      className={cn(
                        'grid size-5 place-items-center rounded-full font-bold',
                        i <= passo ? 'bg-primary text-white' : 'bg-raised text-faint',
                      )}
                      aria-current={i === passo ? 'step' : undefined}
                    >
                      {i + 1}
                    </span>
                    <span className={i === passo ? 'font-semibold text-ink' : 'text-muted'}>{p}</span>
                    {i < PASSOS.length - 1 && <span className="h-px w-5 bg-line-strong" aria-hidden />}
                  </li>
                ))}
              </ol>

              <div ref={stepRef}>
                {passo === 0 && (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      next();
                    }}
                    noValidate
                  >
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-ink">Receba os prazos no WhatsApp</h2>
                      <p className="mt-1 text-sm text-muted">
                        {edital
                          ? `Você vai começar acompanhando ${edital.sigla}. Dá para incluir outros depois.`
                          : 'Leva menos de um minuto. Você pode pausar quando quiser.'}
                      </p>
                    </div>
                    <Field
                      ref={nameRef}
                      label="Nome"
                      autoComplete="name"
                      value={form.nome}
                      onChange={(e) => set('nome', e.target.value)}
                      error={errors.nome}
                    />
                    <Field
                      label="WhatsApp"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="(21) 98765-4321"
                      value={form.whatsapp}
                      onChange={(e) => set('whatsapp', maskPhone(e.target.value))}
                      error={errors.whatsapp}
                    />
                    <Field
                      label="E-mail (opcional)"
                      type="email"
                      autoComplete="email"
                      placeholder="voce@email.com"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      error={errors.email}
                      hint="Usado só para o resumo semanal."
                    />
                    <Button type="submit" className="w-full" size="lg">
                      Continuar
                    </Button>
                  </form>
                )}

                {passo === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-ink">O que você quer receber?</h2>
                      <p className="mt-1 text-sm text-muted">Escolha até 3 áreas para recomendarmos novos editais.</p>
                    </div>
                    <fieldset>
                      <legend className="mb-2 text-sm font-medium text-ink-soft">
                        Áreas de interesse ({form.areas.length}/3)
                      </legend>
                      <div className="flex flex-wrap gap-1.5">
                        {AREAS.map((a) => (
                          <Chip key={a} active={form.areas.includes(a)} onClick={() => toggleArea(a)}>
                            {a}
                          </Chip>
                        ))}
                      </div>
                    </fieldset>
                    <div>
                      <p className="mb-2 text-sm font-medium text-ink-soft">Avisar antes do prazo</p>
                      <SegmentedControl
                        label="Antecedência do aviso"
                        value={form.antecedencia}
                        onChange={(v) => set('antecedencia', v)}
                        options={[
                          { value: 1, label: '1 dia' },
                          { value: 3, label: '3 dias' },
                          { value: 7, label: '7 dias' },
                        ]}
                      />
                    </div>
                    <div className="space-y-3 rounded-xl border border-line p-4">
                      <Switch
                        icon={MessageCircle}
                        label="Avisos no WhatsApp"
                        description="Prazos e retificações dos editais que você acompanha"
                        checked={form.canais.whatsapp}
                        onChange={(v) => set('canais', { ...form.canais, whatsapp: v })}
                      />
                      <Switch
                        icon={Mail}
                        label="Resumo semanal por e-mail"
                        description={
                          form.email ? 'Toda segunda, com os prazos da semana' : 'Volte e informe um e-mail para ativar'
                        }
                        checked={form.canais.email}
                        onChange={(v) => set('canais', { ...form.canais, email: v })}
                      />
                    </div>
                    {errors.canais && (
                      <p role="alert" className="text-sm text-danger-ink">
                        {errors.canais}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="lg" onClick={() => setPasso(0)}>
                        Voltar
                      </Button>
                      <Button variant="action" size="lg" className="flex-1" onClick={next}>
                        Ativar alertas
                      </Button>
                    </div>
                  </div>
                )}

                {passo === 2 && (
                  <div className="py-6 text-center">
                    <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-action/15 text-action-strong">
                      <PartyPopper className="size-6" aria-hidden />
                    </span>
                    <h2 className="font-serif text-2xl font-semibold text-ink">
                      Alertas ativados, {form.nome.trim().split(' ')[0]}
                    </h2>
                    <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
                      Você vai receber avisos {resumoCanais}, {form.antecedencia}{' '}
                      {form.antecedencia === 1 ? 'dia' : 'dias'} antes de cada prazo.
                    </p>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                      <Button variant="outline" to="/radar" onClick={close}>
                        Ver meu radar
                      </Button>
                      <Button onClick={close}>Voltar aos editais</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside
              className="hidden border-l border-line bg-base/60 p-6 sm:p-8 md:block"
              aria-label="Prévia da mensagem"
            >
              <p className="mb-3 text-sm font-medium text-ink-soft">Assim chega no seu celular</p>
              <WhatsAppPreview nome={form.nome} edital={previewEdital} antecedencia={form.antecedencia} />
              <p className="mt-3 text-xs text-faint">Sem spam: no máximo um aviso por prazo.</p>
            </aside>
          </div>
        </div>
      )}
    </Modal>
  );
}
