import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { IEmailData } from '../interfaces/IEmailData';

@Injectable({
  providedIn: 'root',
})
export class SendEmailService {

  supabaseService = inject(SupabaseService)

  sendEmailUserApproved(){}

  sendEmailUserRejected(){}

  async sendEmail(emailData:IEmailData,result:boolean){
    console.log('entrando al servicio de envio de email');
    return await this.supabaseService.client.functions.invoke('send-email',{
      body:{
        ...emailData
      }
    })
  }
}
