import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonBadge,
  IonIcon
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { refreshOutline, restaurantOutline, swapHorizontalOutline, calendarOutline } from 'ionicons/icons';
import { MenuService } from '../services/menu.service';
import { Menu } from '../models/plato.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonBadge,
    IonIcon
  ],
})
export class HomePage implements OnInit {
  cantidadMenus: number = 7;
  menus: Menu[] = [];
  fechaUltimaGeneracion: string | null = null;

  constructor(private menuService: MenuService) {
    addIcons({ refreshOutline, restaurantOutline, swapHorizontalOutline, calendarOutline });
  }

  ngOnInit() {
    // Cargar menús guardados desde localStorage
    this.menuService.cargarMenusDesdeLocalStorage();
    
    // Obtener fecha de última generación
    this.fechaUltimaGeneracion = this.menuService.obtenerFechaUltimaGeneracion();
    
    // Suscribirse a los cambios de menús
    this.menuService.getMenusGenerados().subscribe(menus => {
      this.menus = menus;
      if (menus.length > 0) {
        this.fechaUltimaGeneracion = this.menuService.obtenerFechaUltimaGeneracion();
      }
    });
  }

  generarMenus() {
    if (this.cantidadMenus > 0 && this.cantidadMenus <= 30) {
      this.menuService.generarMenus(this.cantidadMenus);
    }
  }

  limpiarMenus() {
    this.menuService.limpiarMenus();
    this.fechaUltimaGeneracion = null;
  }

  getDiaNombre(index: number): string {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return dias[index % 7];
  }

  getColorOrden(orden: string): string {
    switch(orden) {
      case 'Primero': return 'tertiary';
      case 'Principal': return 'primary';
      case 'Guarnición': return 'success';
      default: return 'medium';
    }
  }

  getFechaFormateada(): string {
    if (!this.fechaUltimaGeneracion) return '';
    
    const fecha = new Date(this.fechaUltimaGeneracion);
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
  }
}
