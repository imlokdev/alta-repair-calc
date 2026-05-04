import type { MechanicItem } from '../types';

export const categories: string[] = ['MECÂNICA', 'KIT\'s', 'SEGURO', 'ESTÉTICA', 'OUTROS'];

export const mechanicsItems: MechanicItem[] = [
  // MECÂNICA
  { id: 'veic', name: 'REPARO DE VEÍCULOS', outputName: 'Reparo de Veículos', price: 150, icon: '🚗', category: 'MECÂNICA', isCera: false, isKit: false },
  { id: 'aero_rep', name: 'REPARO DE AERONAVES', outputName: 'Reparo de Aeronaves', price: 600, icon: '✈️', category: 'MECÂNICA', isCera: false, isKit: false },
  { id: 'pneu_rep', name: 'TROCA DE PNEU E REPARO', outputName: 'Troca de Pneu e Reparo', price: 180, icon: '🔧', category: 'MECÂNICA', isCera: false, isKit: false },
  { id: 'guinc_vei', name: 'GUINCHO ADICIONAL', outputName: 'Guincho Adicional', price: 250, icon: '🚚', category: 'MECÂNICA', isCera: false, isKit: false },

  // KIT'S
  { id: 'kit_sim', name: 'KIT REPARO SIMPLES', outputName: 'Kit Simples', price: 600, icon: '🧰', category: 'KIT\'s', isCera: false, isKit: true },
  { id: 'kit_ava', name: 'KIT REPARO AVANÇADO', outputName: 'Kit Avançado', price: 2200, icon: '🧰', category: 'KIT\'s', isCera: false, isKit: true },

  // SEGURO
  { id: 'seg_norm', name: 'MANDAR CARRO PARA O SEGURO', outputName: 'Seguro de Carro', price: 500, icon: '📄', category: 'SEGURO', isCera: false, isKit: false },
  { id: 'seg_expl', name: 'SEGURO PARA CARRO EXPLODIDO', outputName: 'Seguro (Carro Explodido)', price: 600, icon: '💥', category: 'SEGURO', isCera: false, isKit: false },
  { id: 'seg_aero', name: 'SEGURO DE AERONAVES', outputName: 'Seguro de Aeronaves', price: 700, icon: '✈️', category: 'SEGURO', isCera: false, isKit: false },

  // ESTÉTICA (Ceras)
  { id: 'cera_sim', name: 'CERA AUTOMOTIVA SIMPLES', outputName: 'Cera Simples', price: 600, icon: '🧴', category: 'ESTÉTICA', isCera: true, isKit: false },
  { id: 'cera_pre', name: 'CERA AUTOMOTIVA PREMIUM', outputName: 'Cera Premium', price: 1800, icon: '🧴', category: 'ESTÉTICA', isCera: true, isKit: false },
  { id: 'cera_del', name: 'CERA AUTOMOTIVA DELUXE', outputName: 'Cera Deluxe', price: 4200, icon: '💎', category: 'ESTÉTICA', isCera: true, isKit: false },

  // OUTROS
  { id: 'chave_gri', name: 'CHAVE DE GRIFO', outputName: 'Chave de Grifo', price: 700, icon: '🔧', category: 'OUTROS', isCera: false, isKit: false },
  { id: 'venda_pne', name: 'VENDA DE PNEU', outputName: 'Pneu', price: 180, icon: '🛞', category: 'OUTROS', isCera: false, isKit: false },
  { id: 'gal_vaz', name: 'GALÃO VAZIO DE GASOLINA', outputName: 'Galão Vazio', price: 300, icon: '🛢️', category: 'OUTROS', isCera: false, isKit: false },
  { id: 'venda_gal', name: 'GALÃO DE COMBUSTÍVEL CHEIO', outputName: 'Galão Cheio', price: 700, icon: '⛽', category: 'OUTROS', isCera: false, isKit: false }
];