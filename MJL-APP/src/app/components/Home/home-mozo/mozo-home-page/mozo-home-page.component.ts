import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";


@Component({
  selector: 'app-mozo-home-page',
  templateUrl: './mozo-home-page.component.html',
  styleUrls: ['./mozo-home-page.component.scss'],
  imports: [IonButton, RouterLink]
})
export class MozoHomePageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
