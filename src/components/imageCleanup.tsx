'use client';

import { useEffect } from 'react';

export function ImageCleanup() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const raw = localStorage.getItem('frasapp-delete');
      if (!raw) return;

      try {
        const data = JSON.parse(raw);
        const { filePath, timestamp } = data;

        if (filePath && timestamp && Date.now() - timestamp > 3000) {
          const res = await fetch('/api/deletar-imagem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath }),
          });

          if (res.ok) {
            localStorage.removeItem('frasapp-delete');
            console.log(`[FrasApp] Imagem deletada: ${filePath}`);
          } else {
            console.warn('[FrasApp] Falha ao deletar imagem.');
          }
        }
      } catch (err) {
        console.error('[FrasApp] Erro ao processar deleção:', err);
        localStorage.removeItem('frasapp-delete');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return null; // componente invisível
}
