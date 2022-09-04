import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RutaArduinoComponent } from './ruta-arduino/ruta-arduino.component';

const routes: Routes = [
  {
    path:'arduino',
    component:RutaArduinoComponent
 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
