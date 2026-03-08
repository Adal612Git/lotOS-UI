'use client';

import { useEffect, useState } from 'react';

export function LangToggle() {
  const [lang, setLang] = useState<'en' | 'es'>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('lotos-lang') as 'en' | 'es') ?? 'en';
    setLang(saved);
    document.documentElement.dataset.lang = saved;
  }, []);

  function choose(next: 'en' | 'es') {
    setLang(next);
    document.documentElement.dataset.lang = next;
    localStorage.setItem('lotos-lang', next);
  }

  return (
    <div className="lotos-lang-toggle" role="group" aria-label="Language selector">
      <button
        type="button"
        onClick={() => choose('en')}
        className={lang === 'en' ? 'is-active' : undefined}
        aria-pressed={lang === 'en'}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => choose('es')}
        className={lang === 'es' ? 'is-active' : undefined}
        aria-pressed={lang === 'es'}
      >
        Espanol
      </button>
    </div>
  );
}
