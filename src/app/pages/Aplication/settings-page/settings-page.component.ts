import {Component, inject, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService} from '../../../../services/auth.service';
import {take} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings-page',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit {
  public settingsForm: FormGroup;
  public successMessage: string = '';
  public errorMessage: string = '';

  private authService: AuthService = inject(AuthService);
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  constructor() {
    this.settingsForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit(): void {
    // Cargar datos actuales del usuario desde localStorage pòr si no me va el backend
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.settingsForm.patchValue({
      name: userData.name || '',
      email: userData.email || ''
    });
  }

  public onSubmit(): void {
    if (this.settingsForm.valid) {
      const formData = this.settingsForm.value;
      const userId = this.authService.getUserId();

      const headers = new HttpHeaders().append(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );

      const body = new HttpParams()
        .set('user_id', userId.toString())
        .set('name', formData.name)
        .set('email', formData.email)
        .set('password', formData.password || '');

      this.http.post<any>('http://moodify.test/back/endpoints/users/update_profile.php', body, {headers})
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.successMessage = 'Perfil actualizado correctamente.';
              this.errorMessage = '';

              // Actualizamos userData en localStorage
              localStorage.setItem('userData', JSON.stringify(response.data));
            } else {
              this.errorMessage = response.message;
              this.successMessage = '';
            }
          },
          error: (error) => {
            this.errorMessage = 'Error al actualizar el perfil.';
            this.successMessage = '';
          }
        });
    }
  }

  public deleteAccount(): void {
    const userId = this.authService.getUserId();

    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      const headers = new HttpHeaders().append(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );

      const body = new HttpParams().set('user_id', userId.toString());

      this.http.post<any>('http://moodify.test/back/endpoints/users/delete_user.php', body, { headers })
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            if (response.status === 'success') {
              // Limpiar localStorage y logout
              this.authService.logout();

              // Redirigir al login con mensaje
              this.router.navigate(['/auth/login'], {
                queryParams: { deleted: 'true' }
              });
            } else {
              this.errorMessage = response.message;
              this.successMessage = '';
            }
          },
          error: (error) => {
            this.errorMessage = 'Error al eliminar la cuenta.';
            this.successMessage = '';
          }
        });
    }
  }
}
