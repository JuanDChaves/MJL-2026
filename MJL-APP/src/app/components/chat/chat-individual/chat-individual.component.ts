import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonFooter,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send, chatbubblesOutline } from 'ionicons/icons';
import { IMensajeChat } from 'src/app/interfaces/IMensajeChat';
import { IMensajeChatEnviado } from 'src/app/interfaces/IMensajeChatEnviado';
import { IMesa } from 'src/app/interfaces/IMesa';
import { IMesaCliente } from 'src/app/interfaces/IMesaCliente';
import { IResult } from 'src/app/interfaces/IResult';
import { IUser } from 'src/app/interfaces/IUser';
import { MesaService } from 'src/app/services/mesa-service';
import { NotificationsService } from 'src/app/services/notifications-service';
import { RealtimeService } from 'src/app/services/realtime-service';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-chat-individual',
  templateUrl: './chat-individual.component.html',
  styleUrls: ['./chat-individual.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonFooter,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    ReactiveFormsModule,
  ],
})
export class ChatIndividualComponent implements ViewWillEnter{
  /**
   * LOS MOZOS SE TIENE QUE TRAER TODOS LOS MENSAJES DE LA MESA X 
   * EL CLIENTE SE TIENE QUE TRAER TODOS LOS MENSAJES DE LA MESA X Y CON IGUAL ID AL PROPIO
   */

  // SERVICIOS
  realtimeServ = inject(RealtimeService);
  userService = inject(UserService);
  notiService = inject(NotificationsService);
  mesaService = inject(MesaService);
  private route = inject(ActivatedRoute);

  mesaId = signal<string>(this.route.snapshot.paramMap.get('mesaId')!);
  client = signal<string | null>(null);
  messages = signal<IMensajeChat[]>([]);
  backUrl = signal<string>('/chat-room');
  form = new FormGroup({
    mensaje: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  constructor() {
    addIcons({ send, chatbubblesOutline });
  }
  async ionViewWillEnter(): Promise<void> {
    await this.userService.loadUserData();
    if(this.userService.userData()?.perfil === 'mozo'){
      await this.getClientData();
    }
    const resultMsgs = await this.realtimeServ.getAllMsgClient(this.mesaId());
    if(resultMsgs.success) this.messages.set(resultMsgs.data ?? []);

    this.realtimeServ.canal.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat',
        filter: `mesa_id=eq.${this.mesaId()}`,
      },
      (payload) => {
        console.log(payload);
        const newMsg : IMensajeChat = payload.new as IMensajeChat;
        this.messages.update((old) =>{
          return [...old, newMsg];
        })
      }
    )
    .subscribe();

  }

  async sendMessage(): Promise<void> {
    if (this.form.invalid) return;
    const text = this.form.value.mensaje?.trim();
    if (!text) return;
    const user = this.userService.userData();
    const msgToSend : IMensajeChatEnviado = {
      mensaje: text,
      mesa_id: this.mesaId(),
      user_id: user?.id ?? '',
      nombre_mozo: user?.perfil === 'mozo' ? user.nombres : null,
    }

    if(user?.perfil === 'cliente'){ 
      await this.notiService.consultaParaMozo(user);
    }else{
      await this.notiService.respuestaDelMozo(user!, this.client()!);
    }
    const result = await this.realtimeServ.sendMsg(msgToSend);
    if (!result.success) {
      console.log(result.error);
    }else{
      console.log('mensaje enviado con exito');
    }    
    this.form.reset();
  }

  bubbleInfo(msg: IMensajeChat): string {
    const time = msg.created_at
      ? new Date(msg.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      : '';
    if (msg.nombre_mozo === null) {
      return `Mesa #${1} · ${time}`;
    }
    return `${msg.nombre_mozo ?? 'Mozo'} · ${time}`;
  }

  async getClientData(){
    const result : IResult<IMesa>=  await this.mesaService.getById(this.mesaId()); 
    if(!result.success){
      console.log(result.error);
      return;
    }
    console.log(result.data);
    this.client.set(result.data?.user_id!);
  }

  
}
