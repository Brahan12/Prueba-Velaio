import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { encript } from 'src/app/Models/encript/encript';

interface Tarea {
  titulo: string;
  fechaLimite: string;
  personas: any[];
  completada: boolean;
}

@Component({
  selector: 'app-list-tareas',
  templateUrl: './list-tareas.component.html',
  styleUrls: ['./list-tareas.component.css']
})
export class ListTareasComponent implements OnInit {
  tareasFiltradas: Tarea[] = [];
  tareas: Tarea[] = [];

  private encript: encript = new encript();

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    if (this.activatedRoute.snapshot.queryParams.hasOwnProperty('data')) {
      this.activatedRoute.queryParams.subscribe(params => {
        const data = params['data'];
        if (data) {
          let dataRoute = this.encript.decrypt(data);
          this.tareasFiltradas = JSON.parse(dataRoute);
          this.tareas = [...this.tareasFiltradas];
        }
      });
    }
  }

  ngOnInit(): void {
  }

  // Método para filtrar las tareas
  filtrarTareas(estado: string): void {
    if (estado === 'todas') {
      this.tareasFiltradas = [...this.tareas];
    } else if (estado === 'completadas') {
      this.tareasFiltradas = this.tareas.filter(tarea => tarea.completada);
    } else if (estado === 'pendientes') {
      this.tareasFiltradas = this.tareas.filter(tarea => !tarea.completada);
    }
  }

  // Método para marcar una tarea como completada
  marcarCompletada(tarea: Tarea): void {
    tarea.completada = true;
    this.filtrarTareas('todas');
  }

  toggleCompletada(tarea: Tarea): void {
    tarea.completada = !tarea.completada;
  }

  volver(){
    const serializedData = JSON.stringify(this.tareasFiltradas);
    this.router.navigate([''], {queryParams: {data: this.encript.encrypt(serializedData)}});
  }
}
