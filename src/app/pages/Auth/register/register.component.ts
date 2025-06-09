import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {RouterLink, Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {take} from 'rxjs';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public registerForm: FormGroup;
  public errorMessage: string = '';

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {
    this.registerForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    });

    this.registerForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  public onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;

      this.authService.register(name, email, password).pipe(take(1)).subscribe((response: any) => {
        if (response.status === 'success') {
          this.router.navigate(['/auth/login']);
        } else {
          this.errorMessage = response.message;
        }
      });
    } else {
      this.errorMessage = 'Formulario inválido';
    }
  }
}
