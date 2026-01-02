#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiUdp.h>
#include <MQTT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DallasTemperature.h>
#include <EEPROM.h>
#include <GravityTDS.h>
#include <WebServer.h>
#include <HTML.h>
#include <Preferences.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <ArduinoJson.h>

#define VREF 3.3
#define sampel 30

//Per-define an PinOut
#define tempPin 18
#define tdsPin 34 //set di pin Analog (ADC)
#define trigPin 33
#define echoPin 35
#define pumpPin 25
#define btnreset 32

//Object name
WebServer server(80);

WiFiClient espClient;
MQTTClient client(512);
OneWire oneWire(tempPin);
DallasTemperature sensors (&oneWire);
GravityTDS gravityTds;
LiquidCrystal_I2C lcd(0x27, 16,2);
Preferences preferences;


//credential MQTT Broker
const char broker[] = "broker.emqx.io";
const int port = 1883 ;

char jsonKontrolBuffer[350];
char jsonKontrol[350];

//This is Global Variabel
int buttom_setpoint = 800;
int top_setpoint = 840;
float flowrate = 1.55;

String buffer;
int tdsBefore, tdsAfter, ppmNeed;
bool bufferstatus;

//credential APMode ESP32
const char *ssidAP = "Tho-Tech";
const char *passAP = "012345678";
String ssidNew, passNew;

//Variable for temp sensor
int tempC;
//Variable for Tds Sensor
unsigned int tdsValue, tdsKontrol; 
//Variable for HC-SR04
float distance, sound_speed = 0.034, tinggi;
long duration;
//variabel for volume box 
float panjang = 50; //50cm
float lebar = 30; //30cm
float tinggi_total = 30; //30cm
//variabel for controls sistem
float volumeNutrition, activePump, volume;
bool state = false;

//define task
void kontrolTask(void *parameters);
void connectionTask(void *parameters);
void monitoringTask(void *parameters);

//Get Tempterature Value
void tempRead (){
  sensors.requestTemperatures();
  int suhu = sensors.getTempCByIndex(0);
  tempC = suhu-0.6;
  Serial.println("Suhu : "+ String(tempC));
}

float kValue;
//Get PPM Value
void tdsRead(){
  unsigned int tdsSum = 0;
  for (int i = 0; i<20; i++){
  gravityTds.update();
  gravityTds.setTemperature(tempC);
  unsigned int tds = gravityTds.getTdsValue();
  tdsSum += tds;
  vTaskDelay(10);
  }
  tdsValue = tdsSum/20;
  kValue = gravityTds.getKvalue();
  Serial.print(" PPM : "+String(tdsValue));
  Serial.println("Analog value : " + String(analogRead(tdsPin)));
  Serial.println("kValue : " + String(kValue));
}

//Get Volume Value
void volumeRead(){
  digitalWrite(trigPin,LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin,HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin,LOW);
//get distance sensor from water level
  duration = pulseIn(echoPin,HIGH);
  distance = (duration * sound_speed/2) + 1.2;
  
  tinggi = tinggi_total - distance;
  volume = panjang*lebar*tinggi/1000; //get volume in cm3 and convert to liter
  volume<=0? volume=0 : volume=volume;
}

//Handle save wifi credential
void handleSave() {
  ssidNew = server.arg("ssidNew");
  passNew = server.arg("passNew");
  
  preferences.begin("WiFi-Config", false);
  preferences.putString("ssid", ssidNew);
  preferences.putString("pass", passNew);

  server.send(200,"text/html", sukses_html);
  vTaskDelay(2000);

  if (preferences.isKey("ssid")){
    WiFi.softAPdisconnect(true);
    vTaskDelay(10);
    preferences.end();
    ESP.restart();
  } else {
    Serial.println("Gagal menyimpan WiFi COnfiguration");
  }
}

//connect to Wifi
void Connect(){

    if (ssidNew!="") {
      WiFi.begin(ssidNew.c_str(), passNew.c_str());
      Serial.print("Connecting to WiFi");
      while (WiFi.status() != WL_CONNECTED) {
        vTaskDelay(500);
        Serial.print(".");
      }
      Serial.println("Berhasil terkoneksi ke " + ssidNew);
    } else {
      Serial.println("No WiFi credentials found.");
    }

  }

//get mac addres
String getMACAddress() {
  uint8_t mac[6];  // Array to save MAC address
  String macStr = "";

  // Get MAC address
  WiFi.macAddress(mac);

  // Convert MAC address from byte array to string
  for (int i = 0; i < 6; i++) {
    macStr += String(mac[i], HEX);  // Convert byte to hexadecimal
    if (i < 5) {
      macStr += ":";  // Add ":" as saparator between byte
    }
  }

  return macStr;  // Return MAC address in String
}

// connect to mqtt
  void connectToMQTT() {
    while (!client.connected()) {
      String clientID = getMACAddress(); //use MAC Adrres as client id
      Serial.print("Connecting to MQTT...");
      if (client.connect(clientID.c_str())) {
        Serial.println("connected to MQTT");
      } else {
        Serial.print("failed, rc=");
        Serial.println(" trying again in 2 seconds");
        vTaskDelay(2000);
      }
    }
}

//Load Wifi Login Dashboard
void handleRoot(){
  server.send(200, "text/html", index_html);
}

//Function to reset wifi credentials
void IRAM_ATTR changeWiFi_ISR(){
  // state = true;
  preferences.begin("WiFi-Config", false);
  preferences.clear();
  preferences.end();

  ssidNew = "";
  passNew = "";

  ESP.restart();
}

//Function to Count control systems parameters
float volumeKontrol = 0;
// void kontrol_nutrition(){
//   //count ppm nutrition needed
//   ppmNeed = top_setpoint - tdsBefore;
//   //count volume nutrition needed 
//   volumeNutrition = (float(ppmNeed)/1000)*5*volumeKontrol;
//   //count time to activate pump (in milisecond)
//   activePump = (volumeNutrition / flowrate) * 1000;
//   //activate pump
//   digitalWrite(pumpPin, HIGH);
//   vTaskDelay(activePump);
//   digitalWrite(pumpPin,LOW);
// }

void setup() {
  Serial.begin(115200);
  EEPROM.begin(512);
  pinMode(trigPin,OUTPUT);
  pinMode(echoPin,INPUT);
  pinMode(pumpPin,OUTPUT);
  pinMode(btnreset,INPUT);
  pinMode(tdsPin, INPUT);
  
  attachInterrupt(btnreset,changeWiFi_ISR,FALLING);

  sensors.begin();
  gravityTds.setPin(tdsPin);
  gravityTds.setAdcRange(4096);
  gravityTds.setAref(3.3);
  gravityTds.begin();
  lcd.init();
  lcd.backlight();
 
preferences.begin("WiFi-Config", true);
  if (preferences.isKey("ssid")){

    ssidNew = preferences.getString("ssid");
    passNew = preferences.getString("pass");
    preferences.end();
    Serial.println("ssid : " + ssidNew);
    Serial.println("password : " + passNew);
    Connect();
  } else {
    preferences.end();
    Serial.println("ssid & pass Not Found..!!!!");
    WiFi.softAP(ssidAP,passAP);
    IPAddress myIP = WiFi.softAPIP();
    Serial.print("Login ke Jaringan : ");
    Serial.println(myIP);

    server.on("/", handleRoot);
    server.on("/action_page", handleSave);
    server.begin();
    Serial.println("Server On");
  }
  client.begin(broker, port, espClient);
  client.setKeepAlive(60); 

  xTaskCreatePinnedToCore(connectionTask, "Connecting to WiFi and MQTT Broker", 2048, NULL, 1, NULL, 0);
  xTaskCreatePinnedToCore(monitoringTask, "Sensing & Monitoring", 4096, NULL, 1, NULL, 0);
  xTaskCreatePinnedToCore(kontrolTask, "Kontrol system", 6000, NULL, 1, NULL, 1);
}

void loop() {
  if (WiFi.getMode() == WIFI_AP) {
    server.handleClient();
  }
  client.loop();
}

//Connection Task
void connectionTask(void *parameters){
  for (;;){
      if(WiFi.status()!= WL_CONNECTED){
          Serial.println("Connecting To WiFi...");
          Connect();
          vTaskDelay(1000);
        } else{
          Serial.println("Wifi connected");
        }
      if (!client.connected()) {
        Serial.println("Trying COnnect to MQTT...");
        connectToMQTT();
        vTaskDelay(1000);
      } else {
        Serial.println("Connected to MQTT");
      }
    vTaskDelay(500);
   }
  }

//Monitoring Task
void monitoringTask(void *parameters){
  for(;;){
  tempRead();
  tdsRead();
  volumeRead();
  float volmon = volume;
  int temp = tempC;

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("S:");
  lcd.print(distance);
  lcd.print("cm");
  lcd.print(" V:");
  lcd.print(volmon);
  lcd.print("L");
  
  lcd.setCursor(0, 1);
  lcd.print("N:");
  lcd.print(tdsValue);
  lcd.print("ppm");
  lcd.setCursor(11,1);
  lcd.print("T:");
  
  lcd.print(temp);
  lcd.print("C");

//Send data to server by MQTT using Json Format
  StaticJsonDocument<150> dataMonitoring;
  dataMonitoring["suhu"] = temp;
  dataMonitoring["ppm"] = tdsValue;
  dataMonitoring["volume"] = volmon;

  char jsonBuffer[150];
  serializeJson(dataMonitoring,jsonBuffer);
  if(client.connected()){
    client.publish("skripsi/monitoring/POPNpHBIoTBVLN", jsonBuffer);
    Serial.println("Terhubung ke MQTT dengan Topik : skripsi/monitoring ");
  } else {
    Serial.println("MQTT tidak terhubung");
  }

  Serial.println("ssid : " + ssidNew + "    pass : " + passNew);
  Serial.println("jarak : " + String(distance));
  Serial.println("panjang : " + String(panjang));
  Serial.println("lebar : " + String(lebar));
  Serial.println("tinggi box media : " + String(tinggi_total));
  Serial.println("tinggi: " + String(tinggi));
  Serial.println("volume : " + String(volmon));
  Serial.println("setpoint atas : " + String(top_setpoint));
  Serial.println("setpoint bawah : " + String(buttom_setpoint));
  Serial.println("flowrate : " + String(flowrate));
  Serial.println("Volume nutrisi : " + String(volumeNutrition));
  Serial.println("kebutuhan nutrisi : " + String(ppmNeed));
  Serial.println("waktu pompa aktif : " + String(activePump));
  Serial.println("Volume kontrol : " + String(volumeKontrol));
  vTaskDelay(10000);
  }
}

//Control Nutrition Task
void kontrolTask(void *parameters){
  for (;;){
    if (buttom_setpoint != 0){
      tdsRead();
      tdsKontrol = tdsValue;
      volumeRead();
      float volKon = volume;
      if (tdsKontrol<= buttom_setpoint){
        tdsBefore = tdsKontrol;
        volumeKontrol = volKon;

        ppmNeed = top_setpoint - tdsBefore;
        //count volume nutrition needed 
        volumeNutrition = (float(ppmNeed)/1000)*5*volumeKontrol;
        //count time to activate pump (in milisecond)
        activePump = (volumeNutrition / flowrate) * 1000;
        //activate pump
        digitalWrite(pumpPin, HIGH);
        vTaskDelay(activePump);
        digitalWrite(pumpPin,LOW);
        vTaskDelay(1800000);
        tdsRead();
        tdsAfter = tdsValue;

        if (!client.connected()){
          // kontrol_nutrition();
          // vTaskDelay(1800000);
          // tdsRead();
          // tdsAfter = tdsValue;
          StaticJsonDocument <350> bufferDatakontrol;
          bufferDatakontrol["suhu"] = tempC;
          bufferDatakontrol["volume"] = volumeKontrol;
          bufferDatakontrol["ppm_before"] = tdsBefore;
          bufferDatakontrol["ppm_after"] = tdsAfter;
          bufferDatakontrol["selisih"] = ppmNeed;
          bufferDatakontrol["Vnutrisi"] = volumeNutrition;
          bufferDatakontrol["active_pump"] = activePump;
          bufferDatakontrol["setpoint"] = top_setpoint;

          serializeJson(bufferDatakontrol,jsonKontrolBuffer);
          bufferstatus = true;
        } else {
          // kontrol_nutrition();
          // vTaskDelay(1800000);
          // tdsRead();
          // tdsAfter = tdsValue;
          StaticJsonDocument<350> datakontrol;
          datakontrol["suhu"] = tempC;
          datakontrol["volume"] = volumeKontrol;
          datakontrol["ppm_before"] = tdsBefore;
          datakontrol["ppm_after"] = tdsAfter;
          datakontrol["selisih"] = ppmNeed;
          datakontrol["Vnutrisi"] = volumeNutrition;
          datakontrol["active_pump"] = activePump;
          datakontrol["setpoint"] = top_setpoint;

          serializeJson(datakontrol,jsonKontrol);
          //if(client.connected()){
             client.publish("skripsi/dataKontrol/POPNpHBIoTBVLN", jsonKontrol);
          //}
        Serial.println("Gagal Publish data");
      }
      Serial.println(jsonKontrol);
    }
      if (bufferstatus && client.connected()){

        client.publish("skripsi/dataKontrol/POPNpHBIoTBVLN",jsonKontrolBuffer);
        bufferstatus = false;
      }
    }
    vTaskDelay(1000);
  }
}
