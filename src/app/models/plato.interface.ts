export interface Plato {
  Plato: string;
  Orden: 'Primero' | 'Principal' | 'Guarnición';
  Categoría: string;
  'Lleva Guarnición': 'S' | null;
  'Especial juanvi': 'Juanvi' | null;
}

export interface Menu {
  id: number;
  platos: Plato[];
  platosOpcionales?: Plato[]; // Menú opcional para Juanvi (si el menú principal tiene platos especiales)
}
