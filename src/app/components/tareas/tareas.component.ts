import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { encript } from 'src/app/Models/encript/encript';

interface Tarea {
  titulo: string;
  fechaLimite: string;
  personas: any[];
  completada: boolean;
}

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {
  tareaForm: FormGroup;
  tareas: Tarea[] = [];
  tareasFiltradas: Tarea[] = [];
  validTareas = false;

  private encript: encript = new encript();

  constructor(private fb: FormBuilder,private router: Router, private activatedRoute: ActivatedRoute) {
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
    this.tareaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      fechaLimite: ['', Validators.required],
      personas: this.fb.array([])  // Iniciamos con un arreglo vacío
    });
  }

  ngOnInit(): void {
    this.tareasFiltradas = [...this.tareas]; // Iniciamos con todas las tareas
  }

  // Método para obtener el FormArray de personas
  get personas(): FormArray {
    return this.tareaForm.get('personas') as FormArray;
  }

  // Método para añadir una nueva persona al FormArray
  nuevaPersona(): void {
    const personaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      edad: ['', [Validators.required, Validators.min(18)]],
      habilidades: this.fb.array([this.fb.control('', Validators.required)]) // Iniciamos con una habilidad
    });
    this.personas.push(personaForm);
  }

  // Método para obtener el FormArray de habilidades de una persona
  habilidades(personaIndex: number): FormArray {
    return this.personas.at(personaIndex).get('habilidades') as FormArray;
  }

  // Método para añadir una nueva habilidad a una persona
  agregarHabilidad(personaIndex: number): void {
    this.habilidades(personaIndex).push(this.fb.control('', Validators.required));
  }

  // Método para eliminar una habilidad de una persona
  eliminarHabilidad(personaIndex: number, habilidadIndex: number): void {
    this.habilidades(personaIndex).removeAt(habilidadIndex);
  }

  // Método para eliminar una persona del FormArray
  eliminarPersona(personaIndex: number): void {
    this.personas.removeAt(personaIndex);
  }

  guardarTarea(): void {
    if (this.tareaForm.valid && this.validarPersonas()) {
      const nuevaTarea: Tarea = {
        ...this.tareaForm.value,
        completada: false
      };
      this.tareas.push(nuevaTarea);
      this.tareasFiltradas = [...this.tareas];  // Actualizamos la lista filtrada
      this.tareaForm.reset();
      this.personas.clear();  // Limpiamos las personas después de guardar
      this.mostrarList();
    }
  }

  // Validar el arreglo de personas
  validarPersonas(): boolean {
    const nombres = new Set();
    let esValido = true;

    this.personas.controls.forEach((persona, index) => {
      const nombre = persona.get('nombre')?.value;
      const edad = persona.get('edad')?.value;
      const habilidades = this.habilidades(index);

      // Validar que el nombre no se repita
      if (nombres.has(nombre)) {
        alert(`El nombre "${nombre}" ya está en la lista.`);
        esValido = false;
      } else {
        nombres.add(nombre);
      }

      // Validar que la edad sea mayor de 18
      if (edad <= 18) {
        alert(`La persona "${nombre}" debe tener más de 18 años.`);
        esValido = false;
      }

      // Validar que tenga al menos una habilidad
      if (habilidades.length === 0 || habilidades.controls.some(habilidad => !habilidad.value)) {
        alert(`La persona "${nombre}" debe tener al menos una habilidad válida.`);
        esValido = false;
      }
    });

    return esValido;
  }

  mostrarList(){
    const serializedData = JSON.stringify(this.tareasFiltradas);
    this.router.navigate(['Lista-Tareas'], {queryParams: {data: this.encript.encrypt(serializedData)}});
  }

}
