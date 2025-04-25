import { Component } from '@angular/core';
import {MusicPlayerComponent} from "../../../shared/music-player/music-player.component";
import {RouterOutlet} from "@angular/router";
import {SideBarComponent} from "../../../shared/side-bar/side-bar.component";
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-main-page',
    imports: [
        MusicPlayerComponent,
        RouterOutlet,
        SideBarComponent
    ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
