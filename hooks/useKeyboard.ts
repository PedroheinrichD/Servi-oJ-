'use client'; // Obrigatório no Next.js (App Router)

import { useState, useEffect } from 'react';

export function useKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // Garante que o código só roda no cliente (navegador)
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const visualViewport = window.visualViewport; // varias propriedades como widht e hight
    const initialHeight = visualViewport.height;

    const handleResize = () => {
      const currentHeight = visualViewport.height;
      
      // Se a tela encolher mais de 150px 
      if (currentHeight < initialHeight - 150) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    visualViewport.addEventListener('resize', handleResize); // monitora a viewport
    
    // função de limpeza
    return () => {
      visualViewport.removeEventListener('resize', handleResize);
    };
  }, []);

  return isKeyboardOpen;
}
