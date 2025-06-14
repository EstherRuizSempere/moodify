import {Component, inject, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../../../services/auth.service';
import {take} from 'rxjs';
import {Router} from '@angular/router';
import {UpdateService} from '../../../../services/update.service';
import {DeleteService} from '../../../../services/delete.service';

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
  private updateService: UpdateService = inject(UpdateService);
  private deleteService: DeleteService = inject(DeleteService);
  private router: Router = inject(Router);

  constructor() {
    this.settingsForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit(): void {
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

      this.updateService.updateProfile(userId, formData.name, formData.email, formData.password || '')
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.successMessage = 'Perfil actualizado correctamente.';
              this.errorMessage = '';

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
      this.deleteService.deleteUser(userId)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            if (response.status === 'success') {
              this.authService.logout();
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
