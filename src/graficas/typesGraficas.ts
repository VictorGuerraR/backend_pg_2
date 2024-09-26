export interface Stat {
  title: string;
  amount: string;
  progress: {
    value: number;
  };
  color: string;
}

export type StatKey = 'Total Ganancia' | 'Total Impuesto' | 'Monto Total Servicio' | 'Monto Total Bien';

export const maxValues: Record<StatKey, number> = {
  "Total Ganancia": 2000,
  "Total Impuesto": 600,
  "Monto Total Servicio": 1500,
  "Monto Total Bien": 500,
};