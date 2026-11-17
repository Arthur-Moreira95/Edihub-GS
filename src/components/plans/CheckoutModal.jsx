import { useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { PLANOS } from '../../data/constants.js';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Modal } from '../ui/Overlay.jsx';
import { Button } from '../ui/Button.jsx';
import { SegmentedControl } from '../ui/SegmentedControl.jsx';

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Checkout simulado do Pro: ativa o plano localmente, sem cobrança. */
export function CheckoutModal({ ciclo: cicloInicial, onClose }) {
  const { setPlan } = useApp();
  const { notify } = useToast();
  const [ciclo, setCiclo] = useState(cicloInicial);
  const [metodo, setMetodo] = useState('pix');
  const valor = PLANOS.pro[ciclo];

  return (
    <Modal onClose={onClose} label="Assinar o Pro" className="sm:max-w-md">
      {({ close }) => (
        <div className="p-6 sm:p-8">
          <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary-soft">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <h2 className="mt-4 font-serif text-2xl font-semibold text-ink">Assinar o Edihub Pro</h2>
          <p className="mt-1 text-sm text-muted">Demonstração: nenhum valor será cobrado.</p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-ink-soft">Cobrança</p>
              <SegmentedControl
                label="Ciclo de cobrança"
                value={ciclo}
                onChange={setCiclo}
                options={[
                  { value: 'mensal', label: 'Mensal' },
                  { value: 'semestral', label: 'Semestral' },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink-soft">Pagamento</p>
              <SegmentedControl
                label="Forma de pagamento"
                value={metodo}
                onChange={setMetodo}
                options={[
                  { value: 'pix', label: 'Pix' },
                  { value: 'cartao', label: 'Cartão' },
                  { value: 'boleto', label: 'Boleto' },
                ]}
              />
            </div>
            <div className="flex items-baseline justify-between rounded-xl bg-base px-4 py-3">
              <span className="text-sm text-muted">Total {ciclo === 'mensal' ? 'por mês' : 'por semestre'}</span>
              <span className="tabular font-serif text-2xl font-semibold text-ink">{brl(valor)}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={() => {
              setPlan('pro');
              notify('Plano Pro ativado. Os anúncios já foram removidos.');
              close();
            }}
          >
            <Lock className="size-4" aria-hidden />
            Assinar por {brl(valor)}
          </Button>
        </div>
      )}
    </Modal>
  );
}
