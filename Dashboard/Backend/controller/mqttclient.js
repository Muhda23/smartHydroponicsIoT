import mqtt from 'mqtt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const mqttClient = mqtt.connect("ws://mqtt.lonelybinary.com:9001/mqtt");

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('/skripsi/dataKontrol', (err) => {
    if (!err) {
      console.log('Subscribed to topic');
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  // message is a Buffer
  const dataKontrol = JSON.parse(message.toString());
  console.log("data diterima dari : ", topic);
  console.log(dataKontrol);

  try {
    const data = await prisma.dataKontrols.create({
        data:{
            suhu : dataKontrol.suhu,
            volume : dataKontrol.volume,
            ppm_before : dataKontrol.ppm_before,
            ppm_after : dataKontrol.ppm_after,
            selisih : dataKontrol.selisih,
            Vnutrisi : dataKontrol.Vnutrisi,
            active_pump : dataKontrol.active_pump,
            setpoint : dataKontrol.setpoint
        }
    });
    console.log('Data saved to database:', data);
  } catch (error) {
    console.error('Failed to save data:', error);
  }
});


export default mqttClient
