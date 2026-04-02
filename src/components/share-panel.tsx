'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Share2, Check, Copy, X,
  Facebook, MessageCircle, Mail, Link as LinkIcon
} from 'lucide-react';

interface SharePanelProps {
  title: string;
  description?: string;
  url: string;
  lang?: string;
}

const labels: Record<string, Record<string, string>> = {
  it: {
    share: 'Condividi',
    copyLink: 'Copia Link',
    copied: 'Copiato!',
    close: 'Chiudi',
    shareVia: 'Condividi questo annuncio',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    email: 'Email',
    moreOptions: 'Altre opzioni',
  },
  en: {
    share: 'Share',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    close: 'Close',
    shareVia: 'Share this listing',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    email: 'Email',
    moreOptions: 'More options',
  },
  fr: {
    share: 'Partager',
    copyLink: 'Copier le lien',
    copied: 'Copié !',
    close: 'Fermer',
    shareVia: 'Partager cette annonce',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    email: 'E-mail',
    moreOptions: 'Plus d\'options',
  },
  de: {
    share: 'Teilen',
    copyLink: 'Link kopieren',
    copied: 'Kopiert!',
    close: 'Schliessen',
    shareVia: 'Dieses Inserat teilen',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    email: 'E-Mail',
    moreOptions: 'Mehr Optionen',
  },
};

export function SharePanel({ title, description, url, lang = 'it' }: SharePanelProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const t = labels[lang] || labels['it'];

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title}\n${url}`);

  const shareLinks = [
    {
      id: 'whatsapp',
      label: t.whatsapp,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      href: `https://wa.me/?text=${encodedText}`,
      color: 'text-[#25D366]',
      bg: 'bg-[#25D366]/10 hover:bg-[#25D366]/20',
    },
    {
      id: 'facebook',
      label: t.facebook,
      icon: <Facebook className="w-5 h-5" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'text-[#1877F2]',
      bg: 'bg-[#1877F2]/10 hover:bg-[#1877F2]/20',
    },
    {
      id: 'email',
      label: t.email,
      icon: <Mail className="w-5 h-5" />,
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
      color: 'text-gray-600',
      bg: 'bg-gray-100 hover:bg-gray-200',
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fail silently */
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url });
        return;
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
      }
    }
    setOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center justify-center gap-2 h-[54px] px-5 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 rounded-xl transition-all shadow-sm font-medium text-sm w-full"
      >
        <Share2 className="w-4 h-4 shrink-0" />
        <span>{t.share}</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute bottom-[calc(100%+10px)] right-0 z-50 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <span className="text-sm font-semibold text-gray-900">{t.shareVia}</span>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Share channels */}
          <div className="p-3 flex gap-2">
            {shareLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-colors ${link.bg} ${link.color}`}
              >
                {link.icon}
                <span className="text-[11px] font-medium text-gray-600">{link.label}</span>
              </a>
            ))}
          </div>

          {/* Copy link row */}
          <div className="px-3 pb-3">
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 group-hover:text-black transition-colors">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-gray-900">{copied ? t.copied : t.copyLink}</p>
                <p className="text-[11px] text-gray-400 truncate max-w-[170px]">{url.replace('https://', '')}</p>
              </div>
              {copied && <span className="text-[11px] text-green-600 font-medium">✓</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
