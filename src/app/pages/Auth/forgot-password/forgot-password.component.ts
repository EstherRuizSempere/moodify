import {Component, inject} from '@angular/core';
import {NgIf} from '@angular/common';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {take} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  standalone: true
})
export class ForgotPasswordComponent {
  public forgotForm: FormGroup;
  public successMessage: string = '';
  public errorMessage: string = '';

  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  constructor() {
    this.forgotForm = new FormGroup({
      email: new FormControl(''),
      newPassword: new FormControl('')
    });
  }

  public onSubmit(): void {
    if (this.forgotForm.valid) {
      const formData = this.forgotForm.value;

      const headers = new HttpHeaders().append(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );

      const body = new HttpParams()
        .set('email', formData.email)
        .set('new_password', formData.newPassword);

      this.http.post<any>('http://moodify.test/back/endpoints/users/reset_password.php', body, {headers})
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.successMessage = response.message;
              this.errorMessage = '';

              setTimeout(() => {
                this.router.navigate(['/auth/login']);
              }, 2000);
            } else {
              this.errorMessage = response.message;
              this.successMessage = '';
            }
          },
          error: (error) => {
            this.errorMessage = 'Error al cambiar la contraseña.';
            this.successMessage = '';
          }
        });
    }
  }
  public goBack(): void {
    this.router.navigate(['/auth/login']);
  }

}
