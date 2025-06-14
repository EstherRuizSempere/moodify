import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmotionStatsService } from '../../../../services/emotion-stats.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';

// Registrar Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-graphic-moods-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './graphic-moods-page.component.html',
  styleUrl: './graphic-moods-page.component.css'
})
export class GraphicMoodsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('doughnutChartCanvas', { static: false }) doughnutChartCanvas!: ElementRef<HTMLCanvasElement>;

  public isLoading = true;
  public hasError = false;
  public errorMessage = '';
  public emotionData: any[] = [];

  public doughnutChart: Chart | null = null;
  private chartDataReady = false;

  constructor(private emotionStatsService: EmotionStatsService) {}

  ngOnInit(): void {
    this.loadEmotionStats();
  }

  ngAfterViewInit(): void {
    // Intentar crear el chart si los datos ya están listos
    if (this.chartDataReady && this.emotionData.length > 0 && !this.hasError) {
      this.createDoughnutChart();
    }
  }

  private loadEmotionStats(): void {
    const userId = parseInt(localStorage.getItem('user_id') || '0');

    if (userId === 0) {
      this.hasError = true;
      this.errorMessage = 'No se encontró información del usuario';
      this.isLoading = false;
      return;
    }

    this.emotionStatsService.getUserEmotionStats(userId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 'success' && response.data && response.data.length > 0) {
          this.emotionData = response.data;
          this.chartDataReady = true;

          // Crear el chart después de un pequeño delay para asegurar que el DOM esté listo porque sino, no imprime el gráfico
          setTimeout(() => {
            if (this.doughnutChartCanvas) {
              this.createDoughnutChart();
            }
          }, 100);
        } else {
          // Si no hay datos, no es un error, es estado vacío ya que puedes no tener registros
          this.emotionData = [];
          this.chartDataReady = true;
        }
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Error al cargar las estadísticas de emociones';
      }
    });
  }

  private createDoughnutChart(): void {
    if (!this.doughnutChartCanvas || !this.doughnutChartCanvas.nativeElement) {
      console.error('Canvas no disponible');
      return;
    }

    if (!this.emotionData || this.emotionData.length === 0) {
      console.error('No hay datos para mostrar');
      return;
    }

    // Destruir chart anterior si existe para crear uno nuevo
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
      this.doughnutChart = null;
    }

    const emotionCounts: { [key: string]: number } = {};

    this.emotionData.forEach(item => {
      if (!emotionCounts[item.emotion]) {
        emotionCounts[item.emotion] = 0;
      }
      emotionCounts[item.emotion] += parseInt(item.count);
    });

    const labels = Object.keys(emotionCounts);
    const data = Object.values(emotionCounts);

    console.log('Datos del gráfico:', { labels, data });

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#F9CCC8', '#F2BDCB', '#DCB18B', '#F8E4C5',
            '#FEF9E9', '#EF6589', '#A3D9A5', '#85C1E9',
            '#F5B041', '#BB8FCE', '#F7DC6F', '#AED6F1'
          ],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverBorderColor: '#241d17'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#241d17',
              font: {
                family: 'Zain, sans-serif',
                size: 14,
                weight: 'bold'
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          title: {
            display: true,
            text: 'Distribución de tus emociones',
            color: '#241d17',
            font: {
              family: 'Zain, sans-serif',
              size: 18,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: '#241d17',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#DCB18B',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        }
      }
    };

    try {
      this.doughnutChart = new Chart(this.doughnutChartCanvas.nativeElement, config);
      console.log('Chart creado exitosamente');
    } catch (error) {
      console.error('Error al crear el chart:', error);
      this.hasError = true;
      this.errorMessage = 'Error al crear el gráfico';
    }
  }

  public getTotalCount(): number {
    if (!this.emotionData || this.emotionData.length === 0) return 0;

    return this.emotionData.reduce((total, item) => {
      return total + parseInt(item.count || '0');
    }, 0);
  }

  public getEmotionTypesCount(): number {
    if (!this.emotionData || this.emotionData.length === 0) return 0;

    const emotions = new Set(this.emotionData.map(item => item.emotion));
    return emotions.size;
  }

  public retryLoad(): void {
    this.hasError = false;
    this.isLoading = true;
    this.errorMessage = '';
    this.chartDataReady = false;

    // Destruir chart existente antes de recargar datos para evitar conflictos
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
      this.doughnutChart = null;
    }

    this.loadEmotionStats();
  }

  ngOnDestroy(): void {
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
      this.doughnutChart = null;
    }
  }
}
