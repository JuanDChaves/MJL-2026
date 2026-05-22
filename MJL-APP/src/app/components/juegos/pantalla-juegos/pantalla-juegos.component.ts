import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from "../../layout/layout.component";
import { IonButton } from "@ionic/angular/standalone";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-pantalla-juegos',
  templateUrl: './pantalla-juegos.component.html',
  styleUrls: ['./pantalla-juegos.component.scss'],
  imports: [LayoutComponent, IonButton, IonicModule],
})
export class PantallaJuegosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
