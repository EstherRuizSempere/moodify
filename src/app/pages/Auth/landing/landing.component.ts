import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing',
  template: ''
})
export class LandingComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/app/home']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
