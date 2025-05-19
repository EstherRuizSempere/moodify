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
        title: 'Análisis Emocional',
        description: 'Nunca anotar como ha ido tu día ha sido tan fácil',
        icon: 'fa fa-heart-pulse'
      },
      {
        title: 'Playlists Personalizadas',
        description: 'Recomendaciones musicales únicas basadas en tus emociones',
        icon: 'fa fa-music'
      },
      {
        title: 'Seguimiento del Bienestar',
        description: 'Monitorea cómo la música afecta positivamente tu estado anímico',
        icon: 'fa fa-chart-line'
      }
    ]
  };

  aboutMe = {
    name: 'Tu Nombre',
    role: 'Desarrollador de Moodify',
    bio: 'Apasionado por la música y la tecnología, creé Moodify para unir estas dos pasiones. Creo firmemente que la música tiene el poder de transformar nuestro estado de ánimo y mejorar nuestra calidad de vida.',
    imageUrl: 'assets/about/developer.jpg' // Reemplaza con la ruta a tu imagen
  };
}
