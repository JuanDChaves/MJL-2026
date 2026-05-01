import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/IUsers';
import { DbService } from './db-service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  dbService = inject(DbService);

  async insertNotification(user: IUser) {
    return await this.dbService.insert('notifications', {
      user_id: user.user_id,
      title: 'Nuevo cliente pendiente',
      body: `${user.nombres} ${user.apellidos} solicita acceso`,
      data: { cliente_id: user.user_id, tipo: 'registro_pendiente' },
    });
  }
}
