import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface Persona {
  nombre: string;
  edad: number;
  habilidades: string[];
}

interface Tarea {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  personas?: Persona[];
}

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private tareasSubject = new BehaviorSubject<Tarea[]>([]);
  tareas$ = this.tareasSubject.asObservable();
  apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {}

  obtenerTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  agregarTarea(tarea: Tarea) {
    const tareas = this.tareasSubject.value;
    this.tareasSubject.next([...tareas, tarea]);
  }

  marcarCompletada(id: number) {
    const tareas = this.tareasSubject.value.map(t =>
      t.id === id ? { ...t, completed: true } : t
    );
    this.tareasSubject.next(tareas);
  }

  filtrarTareas(completadas: boolean) {
    return this.tareasSubject.value.filter(t => t.completed === completadas);
  }
}
