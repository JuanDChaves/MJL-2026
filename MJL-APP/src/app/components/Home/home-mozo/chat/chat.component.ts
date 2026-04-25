import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [IonButton, RouterLink]
})
export class ChatComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
