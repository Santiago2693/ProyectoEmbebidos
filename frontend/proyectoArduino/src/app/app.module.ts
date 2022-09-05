import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RutaArduinoComponent } from './ruta-arduino/ruta-arduino.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {LOCALE_ID} from '@angular/core';
import {CommonModule, registerLocaleData} from "@angular/common";
import localeEs from "@angular/common/locales/es";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ColorPickerModule} from 'primeng/colorpicker';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    RutaArduinoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ColorPickerModule,
    SocketIoModule.forRoot({
      url: 'ws://localhost:8080',
      options: {
      }
    }),
    BrowserAnimationsModule,

],
  providers: [ {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    {provide: LOCALE_ID, useValue: 'es'},

],
  bootstrap: [AppComponent]
})
export class AppModule { }
