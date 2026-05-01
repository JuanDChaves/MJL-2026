import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from './user-service';
import { perfilRol } from '../types/typeRol';
import { IUser } from '../interfaces/IUsers';
import { toObservable } from '@angular/core/rxjs-interop';
import { LocalStorageService } from './local-storage-service';

type perfilUser = {
  value: perfilRol;
  label: string;
  icon: string;
};

@Injectable({
  providedIn: 'root',
})
export class RegisterFormService {
  userService = inject(UserService);
  storage = inject(LocalStorageService);

  lastname = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/),
  ]);

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/),
  ]);

  dni = new FormControl('', [
    Validators.required,
    Validators.minLength(7),
    Validators.maxLength(8),
    Validators.pattern(/^\d{7,8}$/),
  ]);

  cuil = new FormControl('', [
    Validators.required,
    Validators.minLength(11),
    Validators.maxLength(11),
    Validators.pattern(/^\d{11}$/),
  ]);

  email = new FormControl('', [Validators.required, Validators.email]);

  pass = new FormControl('', [Validators.required, Validators.minLength(6)]);

  profiles = new FormControl('');

  profileImage = new FormControl(null, [Validators.required]);

  registerForm = new FormGroup({
    correoElectronico: this.email,
    nombres: this.name,
    apellidos: this.lastname,
    clave: this.pass,
    perfil: this.profiles,
    dni: this.dni,
    cuil: this.cuil,
    profileImg: this.profileImage
  });

  profilelist = signal<perfilUser[]>([]);
  profileList$ = toObservable(this.profilelist);

  form = signal<FormGroup>(this.registerForm);
  form$ = toObservable(this.form);

  setPerfilOptions(user: IUser) {
    if (user.perfil === 'duenio' || user.perfil === 'supervisor') {
      this.profilelist.set([
        { value: 'metre', label: 'Metre', icon: 'clipboard' },
        { value: 'mozo', label: 'Mozo', icon: 'restaurant' },
        { value: 'cocinero', label: 'Cocinero', icon: 'beer' },
        { value: 'cantinero', label: 'Cantinero', icon: 'beer' },
      ]);
      if (user.perfil === 'duenio') {
        this.profilelist.update((current) => [
          { value: 'supervisor', label: 'Supervisor', icon: 'people' },
          ...current,
        ]);
      }
    } else if (user.perfil === 'metre') {
      this.profilelist.set([
        { value: 'cliente', label: 'Cliente', icon: 'person' },
      ]);
    }
  }

  setValidatorsOnPerfilControl() {
    if (this.userService.isLogged()) {
      const perfilControl = this.registerForm.get('perfil');
      perfilControl?.setValidators([Validators.required]);
      perfilControl?.updateValueAndValidity();
    } else {
      const perfilControl = this.registerForm.get('perfil');
      perfilControl?.clearValidators();
      perfilControl?.updateValueAndValidity();
    }
  }

  setValidatorsOnCuilControl() {
    const cuilControl = this.registerForm.get('cuil');
    if (
      (this.userService.isLogged() &&
        this.userService.userData()?.perfil === 'duenio') ||
      this.userService.userData()?.perfil === 'supervisor'
    ) {
      cuilControl?.setValidators([
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern(/^\d{11}$/),
      ]);
      cuilControl?.updateValueAndValidity();
    } else {
      cuilControl?.clearValidators();
      cuilControl?.updateValueAndValidity();
    }
  }

  async buildForm() {
    await this.userService.loadUserData();
    const user = this.userService.userData();
    this.setValidatorsOnPerfilControl();
    this.setValidatorsOnCuilControl();
    if (user) {
      this.setPerfilOptions(user);
    }
    this.form.set(this.registerForm);
  }

  cleanForm() {
    this.registerForm.reset();
    this.profilelist.set([]);
  }
}
