import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap, useGSAP } from '../../lib/gsap.js';
import { cn } from '../../lib/cn.js';

function AccordionItem({ item, open, onToggle }) {
  const panel = useRef(null);
  const first = useRef(true);

  // Anima a altura quando o usuário abre/fecha (não no primeiro render)
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        gsap.set(panel.current, { height: open ? 'auto' : 0 });
        return;
      }
      gsap.to(panel.current, { height: open ? 'auto' : 0, duration: 0.35, ease: 'power2.inOut' });
    },
    { dependencies: [open] },
  );

  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-ink hover:text-primary-mist"
        >
          {item.pergunta}
          <ChevronDown className={cn('size-4 shrink-0 text-muted transition-transform', open && 'rotate-180')} />
        </button>
      </h3>
      <div ref={panel} className="overflow-hidden" style={{ height: 0 }} aria-hidden={!open}>
        <p className="max-w-prose pb-4 text-sm leading-relaxed text-muted">{item.resposta}</p>
      </div>
    </div>
  );
}

export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="border-t border-line">
      {items.map((item, i) => (
        <AccordionItem
          key={item.pergunta}
          item={item}
          open={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </div>
  );
}
