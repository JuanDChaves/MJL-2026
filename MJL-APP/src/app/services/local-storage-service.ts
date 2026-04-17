import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  async getData<T>(key: string): Promise<T | null> {
    const data = await Preferences.get({key});
    return data ? JSON.parse(data.value!) as T : null;
  }

  clearData = async() => await Preferences.clear();

  saveData = async(key:string, data:any) => await Preferences.set({key:key, value:JSON.stringify(data)});

  
}
