'use client';

interface GoogleFormEmbedProps {
  src: string;
}

export function GoogleFormEmbed({ src }: GoogleFormEmbedProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <iframe
        src={src}
        title="Formulaire d'inscription Apple Club EPI"
        width="100%"
        height="1100"
        style={{ border: 0 }}
        loading="lazy"
      >
        Chargement du formulaire…
      </iframe>
    </div>
  );
}
