import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AuthPageComponent implements OnInit {
  authForm!: FormGroup;
  register = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['']
    });

    if (this.register) {
      this.authForm.get('name')?.setValidators([Validators.required]);
    } else {
      this.authForm.get('name')?.clearValidators();
    }
    this.authForm.get('name')?.updateValueAndValidity();
  }

  isRegister(): boolean {
    return this.register;
  }

  toggleResgister(): void {
    this.register = !this.register;
    this.initForm();
  }

  onSubmit(): void {
    console.log("Función lanzada")
    if (this.authForm.valid) {
      console.log('Formulario enviado:', this.authForm.value);
    } else {
      this.markFormGroupTouched(this.authForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
