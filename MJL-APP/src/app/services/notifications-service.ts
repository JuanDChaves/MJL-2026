import { inject, Injectable } from '@angular/core';
import { IUserToRegister } from '../interfaces/IUserToRegister';
import { DbService } from './db-service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  dbService = inject(DbService);

  async insertNotification(user: IUserToRegister) {
    return await this.dbService.insert('notifications', {
      user_id: user.user_id,
      title: 'Nuevo cliente pendiente',
      body: `${user.nombres} ${user.apellidos} solicita acceso`,
      data: { cliente_id: user.user_id, tipo: 'registro_pendiente' },
    });
  }
}
