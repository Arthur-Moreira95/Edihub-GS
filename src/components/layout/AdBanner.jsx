import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Modal } from '../ui/Overlay.jsx';

/**
 * Anúncio em banner do plano gratuito (some para assinantes Pro).
 * Clicar no banner abre a peça completa do anunciante num pop-up.
 * Anúncio de demonstração: o botão da oferta só mostra um aviso, nada é reservado.
 */
const BASE = import.meta.env.BASE_URL;
const AD = {
  advertiser: 'SkyDrive',
  banner: {
    alt: 'Anúncio SkyDrive: Viaje mais longe. Pague menos. Reserve agora.',
    webp: `${BASE}ads/banner-skydrive.webp`,
    jpg: `${BASE}ads/banner-skydrive.jpg`,
    width: 1600,
    height: 246,
  },
  popup: {
    alt:
      'SkyDrive, oferta exclusiva de lançamento: viaje mais longe, pague menos. Ganhe até 30% OFF na sua primeira ' +
      'reserva, em destinos nacionais e internacionais. Oferta por tempo limitado. Quero meu desconto.',
    webp: `${BASE}ads/popup-skydrive.webp`,
    jpg: `${BASE}ads/popup-skydrive.jpg`,
    width: 765,
    height: 1024,
  },
};

function AdImage({ img, className, loading = 'lazy' }) {
  return (
    <picture>
      <source srcSet={img.webp} type="image/webp" />
      <img
        src={img.jpg}
        alt={img.alt}
        width={img.width}
        height={img.height}
        loading={loading}
        decoding="async"
        className={className}
      />
    </picture>
  );
}

function SponsoredTag({ className }) {
  return (
    <span
      className={`pointer-events-none absolute rounded bg-black/55 font-semibold tracking-wide text-white uppercase backdrop-blur-sm ${className}`}
    >
      Patrocinado
    </span>
  );
}

export function AdBanner() {
  const { plan } = useApp();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  if (plan === 'pro') return null;

  return (
    <aside aria-label="Publicidade" className="space-y-1.5">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl text-left ring-1 ring-line transition-shadow hover:shadow-lg hover:shadow-shade/30 focus-visible:outline-offset-4"
      >
        <AdImage
          img={AD.banner}
          className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.015]"
        />
        <SponsoredTag className="top-1 left-1 px-1 py-px text-[8px] sm:top-2 sm:left-2 sm:px-1.5 sm:py-0.5 sm:text-[10px]" />
      </button>
      <div className="flex justify-end">
        <Link to="/planos" className="text-xs font-medium text-muted hover:text-ink hover:underline">
          Remover anúncios
        </Link>
      </div>

      {open && (
        <Modal
          onClose={() => setOpen(false)}
          label={`Oferta de ${AD.advertiser}`}
          // painel do tamanho da peça: centralizado também no celular, sem bordas nem fundo próprio
          // (o cn não resolve conflitos, então "!" sobrescreve as classes padrão do Overlay)
          className="mb-[3vh] w-[min(92vw,400px)]! overflow-hidden rounded-2xl! border-0! bg-transparent! sm:mb-0 sm:max-w-none!"
        >
          {({ close }) => (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  close();
                  notify(`Anúncio de demonstração: a oferta da ${AD.advertiser} não está disponível.`, { tone: 'info' });
                }}
                className="block w-full cursor-pointer focus-visible:outline-offset-[-4px]"
              >
                <AdImage img={AD.popup} loading="eager" className="block h-auto max-h-[86vh] w-full object-contain" />
              </button>
              <SponsoredTag className="top-3 left-3 px-1.5 py-0.5 text-[10px]" />
            </div>
          )}
        </Modal>
      )}
    </aside>
  );
}
