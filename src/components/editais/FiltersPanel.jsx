import { AREAS, CATEGORIAS, STATUS, UFS } from '../../data/constants.js';
import { Chip } from '../ui/Chip.jsx';
import { Switch } from '../ui/Switch.jsx';
import { BellRing } from 'lucide-react';

export const STATUS_FILTROS = {
  aberta: STATUS.aberta.label,
  isencao: STATUS.isencao.label,
  'em-breve': STATUS['em-breve'].label,
  andamento: STATUS.andamento.label,
  aguardando: STATUS.aguardando.label,
  retificado: 'Retificação recente',
};

function Group({ title, children }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-semibold text-ink-soft">{title}</legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

/**
 * Filtros controlados. `counts` traz quantos editais cada opção retornaria,
 * para o aluno ver o efeito antes de clicar.
 */
export function FiltersPanel({ filters, setFilter, counts, followedCount }) {
  const toggle = (key, value) => setFilter(key, filters[key] === value ? '' : value);

  return (
    <div className="space-y-6">
      <Switch
        icon={BellRing}
        label="Só os que acompanho"
        description={`${followedCount} no seu radar`}
        checked={filters.seguindo}
        onChange={(v) => setFilter('seguindo', v ? '1' : '')}
      />
      <Group title="Tipo de certame">
        {Object.entries(CATEGORIAS).map(([key, c]) => (
          <Chip
            key={key}
            active={filters.categoria === key}
            onClick={() => toggle('categoria', key)}
            count={counts.categoria[key]}
          >
            {c.label}
          </Chip>
        ))}
      </Group>
      <Group title="Situação">
        {Object.entries(STATUS_FILTROS).map(([key, label]) => (
          <Chip
            key={key}
            active={filters.status === key}
            onClick={() => toggle('status', key)}
            count={counts.status[key]}
          >
            {label}
          </Chip>
        ))}
      </Group>
      <Group title="Onde">
        {Object.entries(UFS).map(([key, label]) => (
          <Chip key={key} active={filters.uf === key} onClick={() => toggle('uf', key)} count={counts.uf[key]}>
            {label}
          </Chip>
        ))}
      </Group>
      <Group title="Área de interesse">
        {AREAS.map((a) => (
          <Chip key={a} active={filters.area === a} onClick={() => toggle('area', a)} count={counts.area[a]}>
            {a}
          </Chip>
        ))}
      </Group>
    </div>
  );
}
