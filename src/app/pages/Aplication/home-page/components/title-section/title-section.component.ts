import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-title-section',
  imports: [],
  templateUrl: './title-section.component.html',
  styleUrl: './title-section.component.css'
})
export class TitleSectionComponent implements OnInit{

  public userName: string = ""

  public ngOnInit() {
    this.userName = JSON.parse(localStorage.getItem("userData")!)?.name || ""
    if (this.userName.length > 0) {
      this.userName = this.userName.charAt(0).toUpperCase() + this.userName.slice(1)
    }
  }

}
