import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.component.html',
  styleUrls: ['./home-supervisor.component.scss'],
  imports: [IonButton,RouterLink],
})
export class HomeSupervisorComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
