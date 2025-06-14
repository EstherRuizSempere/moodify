import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  isMenuOpen = false;


  private router: Router = inject(Router)
  private authService: AuthService = inject(AuthService);

  toggleMenu(event:Event) {
    if(window.innerWidth <= 768) {
      event.preventDefault();
      this.isMenuOpen = !this.isMenuOpen;
    }
  }

  public logout(): void {
    this.authService.logout();

    this.router.navigate(['/auth/login'], { state: { logoutSuccess: true } });
  }

}
