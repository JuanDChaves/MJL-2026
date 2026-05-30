import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonFooter,
  IonInput,
  IonButton,
  IonIcon,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send, chatbubblesOutline, happyOutline, personOutline, checkmarkCircle } from 'ionicons/icons';
import { IMensajeChat } from 'src/app/interfaces/IMensajeChat';
import { IMensajeChatEnviado } from 'src/app/interfaces/IMensajeChatEnviado';
import { IMesa } from 'src/app/interfaces/IMesa';
import { IResult } from 'src/app/interfaces/IResult';
import { MesaService } from 'src/app/services/mesa-service';
import { NotificationsService } from 'src/app/services/notifications-service';
import { RealtimeService } from 'src/app/services/realtime-service';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-chat-individual',
  templateUrl: './chat-individual.component.html',
  styleUrls: ['./chat-individual.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonFooter,
    IonInput,
    IonButton,
    IonIcon,
    ReactiveFormsModule,
  ],
})
export class ChatIndividualComponent implements ViewWillEnter {
  realtimeServ = inject(RealtimeService);
  userService = inject(UserService);
  notiService = inject(NotificationsService);
  mesaService = inject(MesaService);
  private route = inject(ActivatedRoute);

  mesaId = signal<string>(this.route.snapshot.paramMap.get('mesaId')!);
  numeroMesa = signal<string>(this.route.snapshot.paramMap.get('numeroMesa')!);
  client = signal<string | null>(null);
  messages = signal<IMensajeChat[]>([]);
  backUrl = signal<string>('/chat-room');
  isSending = signal(false);
  form = new FormGroup({
    mensaje: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  @ViewChild('content') private content!: IonContent;

  constructor() {
    addIcons({ send, chatbubblesOutline, happyOutline, personOutline, checkmarkCircle });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.userService.loadUserData();
    if (this.userService.userData()?.perfil === 'mozo') {
      await this.getClientData();
    }
    const resultMsgs = await this.realtimeServ.getAllMsgClient(this.mesaId());
    if(resultMsgs.success) this.messages.set(resultMsgs.data ?? []);
    this.scrollToBottom();

    this.realtimeServ.canal.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat',
        filter: `mesa_id=eq.${this.mesaId()}`,
      },
      (payload) => {
        const newMsg : IMensajeChat = payload.new as IMensajeChat;
        this.messages.update((old) => [...old, newMsg]);
        this.scrollToBottom();
      }
    )
    .subscribe();
  }

  async sendMessage(): Promise<void> {
    if (this.form.invalid || this.isSending()) return;
    const text = this.form.value.mensaje?.trim();
    if (!text) return;
    this.isSending.set(true);
    const user = this.userService.userData();
    const msgToSend: IMensajeChatEnviado = {
      mensaje: text,
      mesa_id: this.mesaId(),
      user_id: user?.id ?? '',
      nombre_mozo: user?.perfil === 'mozo' ? user.nombres : null,
    };

    if (user?.perfil === 'cliente') {
      await this.notiService.consultaParaMozo(user);
    } else {
      await this.notiService.respuestaDelMozo(user!, this.client()!);
    }
    const result = await this.realtimeServ.sendMsg(msgToSend);
    if (!result.success) {
      console.log(result.error);
    }
    this.form.reset();
    this.isSending.set(false);
  }

  bubbleTime(msg: IMensajeChat): string {
    if (!msg.created_at) return '';
    const d = new Date(msg.created_at);
    const time = d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    if (msg.nombre_mozo) {
      return `${time} · ${msg.nombre_mozo}`;
    }
    return time;
  }

  isOwnMessage(userId: string | undefined): boolean {
    return userId === this.userService.userData()?.id;
  }

  getInitial(name: string | null): string {
    return name?.charAt(0).toUpperCase() || '?';
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.content?.scrollToBottom(500);
    }, 100);
  }

  async getClientData() {
    const result: IResult<IMesa> = await this.mesaService.getById(this.mesaId());
    if (!result.success) {
      console.log(result.error);
      return;
    }
    this.client.set(result.data?.user_id!);
  }
}
