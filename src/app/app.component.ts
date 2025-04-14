import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SideBarComponent} from './shared/side-bar/side-bar.component';
import {MusicPlayerComponent} from './shared/music-player/music-player.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBarComponent, MusicPlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'moodify';
}
