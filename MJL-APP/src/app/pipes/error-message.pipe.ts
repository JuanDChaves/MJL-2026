import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'errorMessage',
  standalone: true,
  pure: true,
})
export class ErrorMessagePipe implements PipeTransform {
  transform(control: AbstractControl | null, fieldName?: string): string | null {
    if (!control || !control.touched || !control.errors) return null;

    if (control.hasError('required')) return 'Campo obligatorio';
    if (control.hasError('minlength'))
      return `Mínimo ${control.errors?.['minlength']?.requiredLength} caracteres`;
    if (control.hasError('maxlength'))
      return `Máximo ${control.errors?.['maxlength']?.requiredLength} caracteres`;
    if (control.hasError('email')) return 'Correo inválido';
    if (control.hasError('pattern')) {
      if (fieldName === 'dni') return 'Solo números (7-8 dígitos)';
      if (fieldName === 'cuil') return 'Solo numeros de 11 digitos';
      if (fieldName === 'apellidos' || fieldName === 'nombres') return 'Solo letras';
    }
    return null;
  }
}