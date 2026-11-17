import { BellRing } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Button } from '../ui/Button.jsx';

/**
 * Chamada final. As cores vêm das variáveis --cta-* (index.css):
 * no escuro é uma faixa navy de destaque; no claro, um degradê azul-claro com texto navy,
 * sem contraste brusco de escuro com claro.
 */
export function FinalCta() {
  const { openAlerts, prefs } = useApp();
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden rounded-3xl border border-(--cta-border) px-5 py-10 sm:px-12 sm:py-14"
        // border-box: o degradê cobre também a borda (senão ele se repete e aparece um filete na lateral)
        style={{ background: 'var(--cta-bg)', backgroundOrigin: 'border-box' }}
      >
        <div className="relative max-w-2xl">
          <h2 className="font-serif text-3xl leading-tight font-semibold text-(--cta-title) sm:text-4xl">
            Comece grátis e deixe os prazos com a gente.
          </h2>
          <p className="mt-3 text-(--cta-text)">
            O plano gratuito já avisa por e-mail toda semana. No Pro, o aviso chega no WhatsApp na hora em que o edital
            muda, por R$ 59,90 no semestre.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {!prefs.ativo && (
              <Button variant="action" size="lg" className="w-full sm:w-auto" onClick={() => openAlerts()}>
                <BellRing className="size-5" aria-hidden />
                Ativar alertas grátis
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              to="/planos"
              className="w-full border-(--cta-outline) text-(--cta-title) sm:w-auto hover:border-(--cta-outline-hover) hover:bg-(--cta-outline-bg)"
            >
              Comparar planos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
