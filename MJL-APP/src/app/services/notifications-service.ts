import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IResult } from '../interfaces/IResult';
import { IUser } from '../interfaces/IUser';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  dbService = inject(DbService);

  async insertNotification(user: IUser) {
    return await this.dbService.insert('notifications', {
      user_id: user.id,
      title: 'Nuevo cliente pendiente',
      body: `${user.nombres} ${user.apellidos} solicita acceso`,
      data: { cliente_id: user.id, tipo: 'registro_pendiente' },
    });
  }

  async loadNotificationToSuperOrDuenio(
      user: IUser
    ): Promise<IResult<void>> {
      const { error } = await this.insertNotification(user);
      if (error) {
        return {
          success: false,
          error: { message: 'Error al enviar notificacion' },
          data: null,
        };
      }
      return { success: true, error: null, data: null };
    }
}
