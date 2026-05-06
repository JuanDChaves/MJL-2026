import { Injectable, inject } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { SupabaseService } from './supabase-service';
import { LocalStorageService } from './local-storage-service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private sbServ = inject(SupabaseService);
  private storageServ = inject(LocalStorageService);

  async init() {
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive === 'granted') {
      await PushNotifications.register();
    } else {
      console.warn('Push notification permission denied');
      return;
    }

    PushNotifications.addListener('registration', async (token) => {
      console.log('FCM token:', token.value);
      await this.saveTokenToDb(token.value);
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error:', err.error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received in foreground:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push action:', action);
    });
  }

  private async saveTokenToDb(token: string) {
    const userData = await this.storageServ.getData<any>('user');
    if (!userData) {
      console.warn('No user data found, cannot save FCM token');
      return;
    }

    const { error } = await this.sbServ.client
      .from('usuarios')
      .update({ fcm_token: token })
      .eq('user_id', userData.user_id);

    if (error) {
      console.error('Error saving FCM token:', error);
    } else {
      console.log('FCM token saved successfully');
    }
  }

  async removeTokenFromDb() {
    const userData = await this.storageServ.getData<any>('user');
    if (!userData) return;

    await this.sbServ.client
      .from('usuarios')
      .update({ fcm_token: null })
      .eq('user_id', userData.user_id);
  }
}