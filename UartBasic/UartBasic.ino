#include<SoftwareSerial.h>
#include "MatrizLed.h" 
#include <ArduinoJson.h>

MatrizLed pantalla;
SoftwareSerial dw(5,6);
byte datosRecibidos[53]; // comprobado experimentalmente
int LEDROJO = A2;   
int LEDVERDE = A3;    
int LEDAZUL = A4; 

void setup() {
Serial.begin(9600);
dw.begin(9600);
// Inicializar la matriz
pantalla.begin(11,13,10,1); //(dataPin,clockPin,csPin,numDevices)
}

void loop() {
  // Código para desplazamiento de texto
   int disponible = dw.available();
   if(disponible > 0){
      dw.readBytes(datosRecibidos,53);
      messageHandler(datosRecibidos);
    }
   if(Serial.available()){
    dw.write(Serial.read()); 
   }
}

void messageHandler(byte* payload) {
  Serial.println("----");
  Serial.write(payload,53);
  StaticJsonDocument<64> doc;

  DeserializationError error = deserializeJson(doc, payload);

  if (error) {
    return;
  }
  
  String messageKey = doc[0];
  if(messageKey == "escucharMensaje"){
      char * datoMatriz = doc[1]["mensaje"];
      escribirEnMat8x8(datoMatriz);
  } else if ( messageKey == "escucharEventoRGB"){
      String r = doc[1]["r"];
      String g = doc[1]["g"];
      String b = doc[1]["b"];
      int rojo = r.toInt();
      int verde = g.toInt();
      int azul = b.toInt();
      encenderRGB(rojo,verde,azul);
  }
}

void escribirEnMat8x8(char* datoMatriz){
    pantalla.borrar();
    pantalla.escribirFraseScroll(datoMatriz,250);
    pantalla.borrar();
}

void encenderRGB(int r, int g, int b){
  analogWrite(LEDROJO, r);  
  analogWrite(LEDVERDE, g);
  analogWrite(LEDAZUL, b);
  delay(3000);      // pausa de 3 seg.
  analogWrite(LEDROJO, 255);
  analogWrite(LEDVERDE, 255);
  analogWrite(LEDAZUL, 255);
}
