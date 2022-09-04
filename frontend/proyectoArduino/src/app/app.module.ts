import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RutaArduinoComponent } from './ruta-arduino/ruta-arduino.component';

@NgModule({
  declarations: [
    AppComponent,
    RutaArduinoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot({
      url: 'ws://localhost:8080',
      options: {
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
