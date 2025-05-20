import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {RouterLink, Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {take} from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    this.registerForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;

      this.authService.register(name, email, password).pipe(take(1)).subscribe((response: any) => {
        if (response.status === 'success') {
          this.router.navigate(['/auth/login']);
        } else {
          alert("Error en el registro");
        }
      })
    } else {
      console.log('Formulario inválido');
    }
  }
}
