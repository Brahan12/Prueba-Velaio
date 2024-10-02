import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareasComponent } from './components/tareas/tareas.component';
import { ListTareasComponent } from './components/list-tareas/list-tareas.component';

const routes: Routes = [
  {
    path: '',
    component: TareasComponent,
  },
  {
    path: 'Lista-Tareas',
    component: ListTareasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
