import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { IEmailData } from '../interfaces/IEmailData';
import { IResult } from '../interfaces/IResult';

@Injectable({
  providedIn: 'root',
})
export class SendEmailService {

  supabaseService = inject(SupabaseService)

  sendEmailUserApproved(){}

  sendEmailUserRejected(){}

  async sendEmail(emailData:IEmailData): Promise<IResult<void>>{
    const result: IResult<void> = {
      success: false,
      error: null,
      data: null
    }
    const response = await this.supabaseService.client.functions.invoke('send-email',{
      body:{
        ...emailData
      }
    })
    if(response.error){
      result.error = {message: 'Error al enviar el correo'};
      return result;
    }
    result.success = true;
    return result;
  }
}
