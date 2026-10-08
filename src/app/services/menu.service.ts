import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Plato, Menu } from '../models/plato.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private platos: Plato[] = [];
  private menusGenerados$ = new BehaviorSubject<Menu[]>([]);
  
  constructor(private http: HttpClient) {
    this.cargarPlatos();
  }

  private cargarPlatos(): void {
    this.http.get<Plato[]>('assets/database/comidas.json').subscribe({
      next: (data) => {
        this.platos = data;
      },
      error: (error) => {
        console.error('Error cargando platos:', error);
      }
    });
  }

  getMenusGenerados(): Observable<Menu[]> {
    return this.menusGenerados$.asObservable();
  }

  generarMenus(cantidad: number): Menu[] {
    if (this.platos.length === 0) {
      console.error('No hay platos disponibles');
      return [];
    }

    const menus: Menu[] = [];
    const platosUsados = new Set<string>();
    
    // Requisitos mínimos por categoría
    const categoriasRequeridas = {
      'Pasta': 1,
      'Pescado': 1,
      'Verduras': 1,
      'Carne': 1
    };

    const categoriasAsignadas: { [key: string]: number } = {
      'Pasta': 0,
      'Pescado': 0,
      'Verduras': 0,
      'Carne': 0
    };

    // Generar menús
    for (let i = 0; i < cantidad; i++) {
      const menu = this.generarMenuIndividual(platosUsados, categoriasAsignadas, categoriasRequeridas, i < 4);
      if (menu) {
        // Si el menú tiene un plato con "Especial juanvi = Juanvi", añadir menú opcional
        const tieneEspecialJuanvi = menu.some(p => p['Especial juanvi'] === 'Juanvi');
        let menuOpcional: Plato[] | undefined = undefined;
        
        if (tieneEspecialJuanvi) {
          const opcionalesGenerados = this.generarMenuOpcionalJuanvi(platosUsados);
          if (opcionalesGenerados) {
            menuOpcional = opcionalesGenerados;
          }
        }
        
        menus.push({ 
          id: i + 1, 
          platos: menu,
          platosOpcionales: menuOpcional
        });
      }
    }

    // Guardar en localStorage
    this.guardarMenusEnLocalStorage(menus);
    this.menusGenerados$.next(menus);
    return menus;
  }

  private guardarMenusEnLocalStorage(menus: Menu[]): void {
    try {
      localStorage.setItem('menus-semanales', JSON.stringify(menus));
      localStorage.setItem('menus-semanales-fecha', new Date().toISOString());
    } catch (error) {
      console.error('Error guardando menús en localStorage:', error);
    }
  }

  cargarMenusDesdeLocalStorage(): void {
    try {
      const menusGuardados = localStorage.getItem('menus-semanales');
      if (menusGuardados) {
        const menus: Menu[] = JSON.parse(menusGuardados);
        this.menusGenerados$.next(menus);
      }
    } catch (error) {
      console.error('Error cargando menús desde localStorage:', error);
    }
  }

  private generarMenuIndividual(
    platosUsados: Set<string>,
    categoriasAsignadas: { [key: string]: number },
    categoriasRequeridas: { [key: string]: number },
    esPrimerosMenus: boolean
  ): Plato[] | null {
    const menu: Plato[] = [];
    
    // Determinar si necesitamos cumplir alguna categoría requerida
    let categoriaObligatoria: string | null = null;
    if (esPrimerosMenus) {
      for (const [categoria, requerido] of Object.entries(categoriasRequeridas)) {
        if (categoriasAsignadas[categoria] < requerido) {
          categoriaObligatoria = categoria;
          break;
        }
      }
    }

    // Seleccionar plato principal
    let platosPrincipales = this.platos.filter(p => 
      p.Orden === 'Principal' && 
      !platosUsados.has(p.Plato)
    );

    // Aplicar filtro de categoría si es necesario
    if (categoriaObligatoria) {
      const platosFiltrados = platosPrincipales.filter(p => p['Categoría'] === categoriaObligatoria);
      if (platosFiltrados.length > 0) {
        platosPrincipales = platosFiltrados;
      }
    }

    if (platosPrincipales.length === 0) {
      return null;
    }

    const platoPrincipal = this.seleccionarAleatorio(platosPrincipales);
    menu.push(platoPrincipal);
    platosUsados.add(platoPrincipal.Plato);
    
    // Actualizar contador de categorías
    const categoria = platoPrincipal['Categoría'];
    if (categoriasAsignadas.hasOwnProperty(categoria)) {
      categoriasAsignadas[categoria]++;
    }

    // Si el plato principal lleva guarnición, añadir una
    if (platoPrincipal['Lleva Guarnición'] === 'S') {
      const guarniciones = this.platos.filter(p => 
        p.Orden === 'Guarnición' && 
        !platosUsados.has(p.Plato)
      );
      
      if (guarniciones.length > 0) {
        const guarnicion = this.seleccionarAleatorio(guarniciones);
        menu.push(guarnicion);
        platosUsados.add(guarnicion.Plato);
      }
    }

    // Opcionalmente añadir un primero (30% de probabilidad)
    if (Math.random() < 0.3) {
      const primeros = this.platos.filter(p => 
        p.Orden === 'Primero' && 
        !platosUsados.has(p.Plato)
      );
      
      if (primeros.length > 0) {
        const primero = this.seleccionarAleatorio(primeros);
        menu.unshift(primero); // Añadir al principio
        platosUsados.add(primero.Plato);
      }
    }

    return menu;
  }

  private generarMenuOpcionalJuanvi(platosUsados: Set<string>): Plato[] | null {
    // Buscar platos que NO sean "Especial juanvi = Juanvi"
    const platosDisponibles = this.platos.filter(p => 
      p.Orden === 'Principal' && 
      p['Especial juanvi'] !== 'Juanvi' &&
      !platosUsados.has(p.Plato)
    );

    if (platosDisponibles.length === 0) {
      return null;
    }

    const menu: Plato[] = [];
    const platoPrincipal = this.seleccionarAleatorio(platosDisponibles);
    menu.push(platoPrincipal);
    platosUsados.add(platoPrincipal.Plato);

    // Si lleva guarnición, añadir una
    if (platoPrincipal['Lleva Guarnición'] === 'S') {
      const guarniciones = this.platos.filter(p => 
        p.Orden === 'Guarnición' && 
        !platosUsados.has(p.Plato)
      );
      
      if (guarniciones.length > 0) {
        const guarnicion = this.seleccionarAleatorio(guarniciones);
        menu.push(guarnicion);
        platosUsados.add(guarnicion.Plato);
      }
    }

    return menu;
  }

  private seleccionarAleatorio<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  limpiarMenus(): void {
    this.menusGenerados$.next([]);
    // También limpiar localStorage
    try {
      localStorage.removeItem('menus-semanales');
      localStorage.removeItem('menus-semanales-fecha');
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  obtenerFechaUltimaGeneracion(): string | null {
    try {
      return localStorage.getItem('menus-semanales-fecha');
    } catch (error) {
      return null;
    }
  }
}
