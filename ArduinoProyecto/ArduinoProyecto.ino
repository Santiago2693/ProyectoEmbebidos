#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ArduinoJson.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>
#include <typeinfo>
#include <Hash.h>
#include<DHT.h>
#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;
SocketIOclient socketIO;
DHT sensorTempH(5,DHT22);


void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case sIOtype_DISCONNECT:
      USE_SERIAL.printf("[IOc] Disconnected!\n");
      break;
    case sIOtype_CONNECT:
      USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

      // join default namespace (no auto join in Socket.IO V3)
      socketIO.send(sIOtype_CONNECT, "/");
      break;
    case sIOtype_EVENT:
      //USE_SERIAL.printf("[\"escucharEventoRGB\",{\"r\":255,\"g\":255,\"b\":255}]");
      //USE_SERIAL.printf("Mensaje recibido con tamano %d y string %s\n", length, (byte *)payload);
      USE_SERIAL.write((byte*)payload, length);
      break;
    case sIOtype_ACK:
      USE_SERIAL.printf("[IOc] get ack: %u\n", length);
      hexdump(payload, length);
      break;
    case sIOtype_ERROR:
      USE_SERIAL.printf("[IOc] get error: %u\n", length);
      hexdump(payload, length);
      break;
    case sIOtype_BINARY_EVENT:
      USE_SERIAL.printf("[IOc] get binary: %u\n", length);
      hexdump(payload, length);
      break;
    case sIOtype_BINARY_ACK:
      USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
      hexdump(payload, length);
      break;
  }
}

void setup() {
  // USE_SERIAL.begin(921600);
  USE_SERIAL.begin(9600);
  

  //Serial.setDebugOutput(true);
  USE_SERIAL.setDebugOutput(true);

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  // disable AP
  if (WiFi.getMode() & WIFI_AP) {
    WiFi.softAPdisconnect(true);
  }

  WiFiMulti.addAP("NETLIFE-MUNOZ", "1723171714");

  //WiFi.disconnect();
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  String ip = WiFi.localIP().toString();
  USE_SERIAL.printf("[SETUP] WiFi Connected %s\n", ip.c_str());

  // server address, port and URL
  socketIO.begin("192.168.100.238", 8080, "/socket.io/?EIO=4");

  // event handler
  socketIO.onEvent(socketIOEvent);
  sensorTempH.begin();
}

unsigned long messageTimestamp = 0;
void loop() {
  

  /*===============*/
  socketIO.loop();

  uint64_t now = millis();

  if (now - messageTimestamp > 5000) {
    messageTimestamp = now;
    sensarTemperatura();
    
  }
}

void sensarTemperatura(){
// Leemos la humedad relativa
  float h = sensorTempH.readHumidity();
  // Leemos la temperatura en grados centígrados (por defecto)
  float t = sensorTempH.readTemperature();
   // Comprobamos si ha habido algún error en la lectura
  if (isnan(h) || isnan(t)) {
    return;
  }
  notificarTemperatura(t,h);
   
}

void notificarTemperatura(float temperatura, float humedad){
// creat JSON message for Socket.IO (event)
    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    // add evnet name
    // Hint: socket.on('event_name', ....
    array.add("enviarTemperaturaYHumedad");

    // add payload (parameters) for the event
    JsonObject param1 = array.createNestedObject();
    param1["temperatura"] = temperatura;
    param1["humedad"] = humedad;

    // JSON to String (serializion)
    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);
}
