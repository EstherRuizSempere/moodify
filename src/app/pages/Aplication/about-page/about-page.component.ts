import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-about-page',
  imports: [CommonModule],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent {
  aboutMoodify = {
    title: '¿Qué es Moodify?',
    description: [
      'Moodify es una plataforma que te ayuda a conectar con tu estado de ánimo mientras escuchas música, conectar a nivel personal a veces resulta dificil por lo que Moodify trata de hacerte sentir mientras conectas con la música para ' +
      'facilitarlo.',
      'Ya sea que necesites motivación, relajación o simplemente quieras disfrutar de música que resuene con tu sentir, Moodify te acompaña en tu experiencia musical diaria.'
    ],
    features: [
      {
        title: 'Análisis Emocional 🧠',
        description: 'Nunca anotar como ha ido tu día ha sido tan fácil 😀',
        icon: 'fa fa-heart-pulse'
      },
      {
        title: 'Playlists según tu mood 🌸',
        description: 'Elegidas personalmente por Moodify para ti, no cantar a pleno pulmón no es opción 👩🏼‍🎤',
        icon: 'fa fa-music'
      },
      {
        title: 'Gráficos personalizados 🍩',
        description: '¿Cuántas veces nos pasa que no sabemos como sentimos? ¿Solemos estar más enfadados o felices? Moodify te ayuda a descubrirlo. 🫂',
        icon: 'fa fa-chart-pie'
      }
    ]
  };

  aboutMe = {
    name: 'Esther Ruiz Sempere',
    role: 'Desarrolladora de Moodify',
    bio: 'Antigua maquilladora y futura desarrolladora web. Me encanta aprender y crear cosas nuevas. ' +'Moodify no nace de mi y mis experiencias personales, de la necesidad de crecer, desconectar y sentir.',
    imageUrl: 'assets/images/P1030668.jpeg'
  };
}
