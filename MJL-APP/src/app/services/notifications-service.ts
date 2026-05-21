import { inject, Injectable } from '@angular/core';
import { DbService } from './db-service';
import { IResult } from '../interfaces/IResult';
import { IUser } from '../interfaces/IUser';
import { TipoPerfil } from '../types/TipoPerfil';
import { INotificacionInfo } from '../interfaces/INotificacionInfo';
import { TipoProducto } from '../interfaces/IProducto';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  dbService = inject(DbService);

  private async insertNotification(
    perfilesANotificar: TipoPerfil[],
    notificacionInfo: INotificacionInfo,
    cliente_a_notificar?: string,
  ): Promise<IResult<void>> {
    const result: IResult<void> = {
      success: false,
      error: null,
      data: null,
    };
    const response = await this.dbService.insert('notifications', {
      ...notificacionInfo,
      perfiles_a_notificar: perfilesANotificar,
      cliente_a_notificar: cliente_a_notificar ?? null,
    });
    if (response.error) {
      result.error = { message: 'Error al enviar notificacion' };
      return result;
    }
    result.success = true;
    return result;
  }

  async nuevoUsuarioRegistrado(nuevoUsuario: IUser) {
    const notiInfo: INotificacionInfo = {
      title: 'Nuevo usuario registrado',
      body: `El usuario ${nuevoUsuario.nombres} ${nuevoUsuario.apellidos} se ha registrado en la aplicacion`,
      data: {
        cliente_id: nuevoUsuario.id,
        tipo: 'registro_pendiente',
      },
    };
    return await this.insertNotification(['duenio', 'supervisor'], notiInfo);
  }

  async ingresoListaEspera(user: IUser) {
    const notiInfo: INotificacionInfo = {
      title: 'Nuevo ingreso en lista de espera',
      body: `El usuario ${user.nombres} ${user.apellidos} ha ingresado a la lista de espera.`,
      data: {
        cliente_id: user.id,
        tipo: 'ingreso_pendiente',
      },
    };
    return await this.insertNotification(['metre'], notiInfo);
  }

  async consultaCliente(user: IUser) {
    const notiInfo: INotificacionInfo = {
      title: 'Mensaje nuevo de un cliente',
      body: `${user.nombres} ${user.apellidos} realizo una consulta en el chat.`,
      data: {
        cliente_id: user.id,
        tipo: 'mensaje_pendiente',
      },
    };
    return await this.insertNotification(['mozo'], notiInfo);
  }

  async respuestaMozo(user: IUser) {
    const notiInfo: INotificacionInfo = {
      title: 'Tiene un mensaje de un mozo',
      body: `${user.nombres} ha respondido un mensaje.`,
      data: {
        cliente_id: user.id,
        tipo: 'mensaje_pendiente',
      },
    };
    return await this.insertNotification(['cliente'], notiInfo, user.id);
  }

  async confirmacionPedido(user: IUser) {
    const notiInfo: INotificacionInfo = {
      title: 'Pedido confirmado',
      body: `Tu pedido ha sido confirmado, ya puede ser ver su estado escaneando el qr de la mesa.`,
      data: {
        cliente_id: user.id,
        tipo: 'mensaje_pendiente',
      },
    };
    return await this.insertNotification(['cliente'], notiInfo, user.id);
  }

  async rechazaPedido(user: IUser) {
    const notiInfo: INotificacionInfo = {
      title: 'Pedido rechazado',
      body: `No pudimos aprobar tu pedido realizalo nuevamente`,
      data: {
        cliente_id: user.id,
        tipo: 'mensaje_pendiente',
      },
    };
    return await this.insertNotification(['cliente'], notiInfo, user.id);
  }

  async enviarPedidoBar() {
    const notiInfo: INotificacionInfo = {
      title: 'Nuevo pedido de bar',
      body: `Ya podes comenzar a preparar el pedido`,
      data: {
        cliente_id: null,
        tipo: 'pedido_bar',
      },
    };
    return await this.insertNotification(['cantinero'], notiInfo);
  }

  async enviarPedidoCocina() {
    const notiInfo: INotificacionInfo = {
      title: 'Nuevo pedido de cocina',
      body: `Ya podes comenzar a preparar el pedido`,
      data: {
        cliente_id: null,
        tipo: 'pedido_cocina',
      },
    };
    return await this.insertNotification(['cocinero'], notiInfo);
  }

  async pedidoterminado(sector: TipoProducto) {
    const notiInfo: INotificacionInfo = {
      title:
        sector === 'bebida'
          ? 'Pedido de bar terminado'
          : 'Pedido de cocina terminado',
      body:
        sector === 'bebida'
          ? 'Todas las bebidas fueron preparadas'
          : 'Todos los platos fueron preparados',
      data: {
        cliente_id: null,
        tipo: 'pedido_cocina',
      },
    };
    return await this.insertNotification(['mozo'], notiInfo);
  }

  async pedirCuenta(user: IUser) {
    const notiInfo: INotificacionInfo = {
      title: "Pedido de cuenta",
      body: `El cliente ${user.nombres} ${user.apellidos} ha pedido la cuenta`,
      data: {
        cliente_id: null,
        tipo: 'pedido_cuenta',
      },
    };
    return await this.insertNotification(['mozo'], notiInfo);
  }

  async realizoPago(user: IUser){
    const notiInfo: INotificacionInfo = {
      title: "Pago realizado",
      body: `El cliente ${user.nombres} ${user.apellidos} ha realizado el pago`,
      data: {
        cliente_id: user.id,
        tipo: 'pago_realizado',
      },
    };
    return await this.insertNotification(['mozo'], notiInfo);
  }

  async confirmacionPago(user: IUser){
    const notiInfoUser: INotificacionInfo = {
      title: "Pago confirmado",
      body: `Tu pago ha sido confirmado, hasta la proxima vez`,
      data: {
        cliente_id: user.id,
        tipo: 'pago_confirmado',
      },
    };
    const notiInfo: INotificacionInfo = {
      title: "Pago confirmado",
      body: `Se confirmo el pago del cliente ${user.nombres} ${user.apellidos}`,
      data: {
        cliente_id: null,
        tipo: 'pago_confirmado',
      },
    };
    await this.insertNotification(['duenio', 'supervisor'], notiInfo);
    return await this.insertNotification(['cliente'], notiInfoUser, user.id);
  }
}
