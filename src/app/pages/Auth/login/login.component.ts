import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink, ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {take} from 'rxjs';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public errorMessage: string = '';
  public successMessage: string = '';

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.loginForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  ngOnInit(): void {
    if (history.state.logoutSuccess) {
      this.errorMessage = 'Has cerrado sesión correctamente.';
    }

    this.route.queryParams.subscribe(params => {
      if (params['deleted'] === 'true') {
        this.successMessage = 'Tu cuenta ha sido eliminada correctamente.';
      }
    });
  }

  public onSubmit(): void {
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.value;

      this.authService.login(email, password).pipe(take(1)).subscribe((response: any) => {
        if (response.status === 'success') {
          localStorage.setItem('userData', JSON.stringify(response.data));
          localStorage.setItem('user_id', response.data.id.toString());
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message;
        }
      });
    } else {
      this.errorMessage = 'Formulario inválido';
    }
  }
}
