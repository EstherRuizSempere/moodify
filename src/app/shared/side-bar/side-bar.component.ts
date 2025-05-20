import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

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

  toggleMenu(event:Event) {
    if(window.innerWidth <= 768) {
      event.preventDefault();
      this.isMenuOpen = !this.isMenuOpen;
    }
  }

  public logout(){
    localStorage.removeItem('userData');
    this.router.navigate(['/auth/login']);
  }
}
