import {Component} from '@angular/core';
import {MoodsComponent} from './components/moods/moods.component';
import {Emotions} from '../../interfaces/emotions';
import {MoodsDataService} from '../../../services/moods-data.service';
import {ModalEmotionsComponent} from './components/modal-emotions/modal-emotions.component';


@Component({
  selector: 'app-feels-page',
  imports: [
    MoodsComponent,
    ModalEmotionsComponent
  ],
  templateUrl: './feels-page.component.html',
  styleUrl: './feels-page.component.css'
})
export class FeelsPageComponent {
  datosMoods: Emotions[] = [];

  constructor(private moodsDataService: MoodsDataService) {
  }

  ngOnInit() {
    this.moodsDataService.getData().subscribe(datos => {
      this.datosMoods = datos;
      console.log(datos)
    })

  }
}
