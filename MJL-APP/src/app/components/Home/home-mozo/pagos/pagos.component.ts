import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
  imports: [IonButton, RouterLink]
})
export class PagosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
