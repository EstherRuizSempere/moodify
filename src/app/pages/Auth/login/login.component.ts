import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {take} from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public loginForm: FormGroup

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    this.loginForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
    });
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).pipe(take(1)).subscribe((response: any) => {
        if (response.status === 'success') {
          localStorage.setItem('userData', JSON.stringify(response.data));
          this.router.navigate(['/']);
        } else {
          alert("Credenciales incorrectas");
        }
      })
    } else {
      console.log('Formulario inválido');
    }
  }
}
