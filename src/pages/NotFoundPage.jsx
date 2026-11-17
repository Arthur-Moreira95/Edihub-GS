import { Compass } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Button } from '../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <EmptyState
        icon={Compass}
        title="Esta página não existe"
        action={
          <div className="flex gap-2">
            <Button to="/editais">Ver editais</Button>
            <Button variant="ghost" to="/">
              Ir para o início
            </Button>
          </div>
        }
      >
        O endereço pode ter mudado. Procure o edital pela busca ou volte para o início.
      </EmptyState>
    </div>
  );
}
