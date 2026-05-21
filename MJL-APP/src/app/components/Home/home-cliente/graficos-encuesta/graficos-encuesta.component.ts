import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EncuestasService } from 'src/app/services/encuestas.service';
import Chart from 'chart.js/auto'; // Importación de la librería de gráficos
import { IonicModule } from '@ionic/angular'; // Si usas standalone o importalos uno por uno
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-graficos-encuesta',
  templateUrl: './graficos-encuesta.component.html',
  styleUrls: ['./graficos-encuesta.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class GraficosEncuestaComponent implements OnInit {
  @ViewChild('graficoCanvas') graficoCanvas!: ElementRef;
  
  chart: any;
  encuestas: any[] = [];
  cargando = true;
  
  graficoActual = 1; // 1: Torta (Comida), 2: Barras (Bebida), 3: Lineal (Atención)

  constructor(
    private encuestasService: EncuestasService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.cargando = true;
    this.encuestas = await this.encuestasService.obtenerTodasLasEncuestas();
    this.cargando = false;
    
    // Le damos un pequeño delay para asegurarnos que el Canvas del HTML ya se dibujó
    setTimeout(() => {
      this.renderizarGrafico();
    }, 100);
  }

  cambiarGrafico(direccion: number) {
    this.graficoActual += direccion;
    if (this.graficoActual > 3) this.graficoActual = 1;
    if (this.graficoActual < 1) this.graficoActual = 3;
    this.renderizarGrafico();
  }

  renderizarGrafico() {
    if (this.chart) {
      this.chart.destroy(); // Destruimos el gráfico anterior antes de crear uno nuevo
    }

    const ctx = this.graficoCanvas.nativeElement.getContext('2d');

    if (this.graficoActual === 1) {
      this.dibujarGraficoTorta(ctx);
    } else if (this.graficoActual === 2) {
      this.dibujarGraficoBarras(ctx);
    } else if (this.graficoActual === 3) {
      this.dibujarGraficoLineal(ctx);
    }
  }

  // GRÁFICO 1: TORTA (Satisfacción Comida - Estrellas)
  dibujarGraficoTorta(ctx: any) {
    const conteo = { '5★': 0, '4★': 0, '3★': 0, '2★': 0, '1★': 0 };
    this.encuestas.forEach(e => {
      if (e.satisfaccion_comida === 5) conteo['5★']++;
      else if (e.satisfaccion_comida === 4) conteo['4★']++;
      else if (e.satisfaccion_comida === 3) conteo['3★']++;
      else if (e.satisfaccion_comida === 2) conteo['2★']++;
      else if (e.satisfaccion_comida === 1) conteo['1★']++;
    });

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(conteo),
        datasets: [{
          data: Object.values(conteo),
          backgroundColor: ['#2E7D32', '#8BC34A', '#FFEB3B', '#FF9800', '#F44336']
        }]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Satisfacción: Comida', font: { size: 18 } } } }
    });
  }

  // GRÁFICO 2: BARRAS (Satisfacción Bebida)
  dibujarGraficoBarras(ctx: any) {
    const conteo: any = { 'Excelente': 0, 'Muy Bueno': 0, 'Bueno': 0, 'Regular': 0, 'Malo': 0 };
    this.encuestas.forEach(e => {
      if (conteo[e.satisfaccion_bebida] !== undefined) {
        conteo[e.satisfaccion_bebida]++;
      }
    });

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(conteo),
        datasets: [{
          label: 'Votos',
          data: Object.values(conteo),
          backgroundColor: '#1976D2'
        }]
      },
      options: { responsive: true, plugins: { title: { display: true, text: 'Satisfacción: Bebidas', font: { size: 18 } } } }
    });
  }

  // GRÁFICO 3: LINEAL (Atención del 1 al 10)
  dibujarGraficoLineal(ctx: any) {
    // Para el lineal mostramos los últimos votos en orden cronológico
    const puntajesAtencion = this.encuestas.map(e => e.satisfaccion_atencion);
    const labels = this.encuestas.map((e, index) => `Voto ${index + 1}`);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Puntaje Atención (1-10)',
          data: puntajesAtencion,
          borderColor: '#B71C1C',
          tension: 0.3,
          fill: true,
          backgroundColor: 'rgba(183, 28, 28, 0.2)'
        }]
      },
      options: { 
        responsive: true, 
        scales: { y: { min: 0, max: 10 } },
        plugins: { title: { display: true, text: 'Historial de Atención al Cliente', font: { size: 18 } } } 
      }
    });
  }

  volver() {
    this.router.navigate(['/ingreso-local-cliente']);
  }
}