export interface MechanicItem {
  id: string;
  name: string;
  outputName: string;
  price: number;
  icon: string;
  category: string;
  isCera: boolean;
  isKit: boolean;
}

export interface HistoryRecord {
  id: number;
  time: string;
  passportId: string;
  total: number;
  summary: string;
  kitsText: string;
  cerasText: string;
}