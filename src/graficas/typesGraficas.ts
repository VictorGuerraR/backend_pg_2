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
  "Total Ganancia": 4000,
  "Total Impuesto": 600,
  "Monto Total Servicio": 4000,
  "Monto Total Bien": 4000,
};