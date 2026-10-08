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
import { refreshOutline, restaurantOutline, swapHorizontalOutline } from 'ionicons/icons';
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

  constructor(private menuService: MenuService) {
    addIcons({ refreshOutline, restaurantOutline, swapHorizontalOutline });
  }

  ngOnInit() {
    this.menuService.getMenusGenerados().subscribe(menus => {
      this.menus = menus;
    });
  }

  generarMenus() {
    if (this.cantidadMenus > 0 && this.cantidadMenus <= 30) {
      this.menuService.generarMenus(this.cantidadMenus);
    }
  }

  limpiarMenus() {
    this.menuService.limpiarMenus();
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
}
