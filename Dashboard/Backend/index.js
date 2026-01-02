import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dataRoute from "./routes/dataRoute.js";
import mqtt, { MqttClient } from "mqtt";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();
// import mqttclient from "./controller/mqttclient.js"
dotenv.config();

//new methode
const app = express();

app.use(cors());
app.use(express.json());
app.use(dataRoute);

const mqttClient = mqtt.connect("ws://broker.emqx.io:8083/mqtt");
//let lastReceivedData = null;
let dataMonitoring = null;
let dataKontrols = null;

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("skripsi/dataKontrol/POPNpHBIoTBVLN", (err) => {
    if (!err) {
      console.log("Subscribed to topic skripsi/dataKontrol/POPNpHBIoTBVLN");
    }
  });
  mqttClient.subscribe("skripsi/monitoring/POPNpHBIoTBVLN", (err) => {
    if (!err) {
      console.log("Subscribed to topic skripsi/monitoring/POPNpHBIoTBVLN");
    }
  });
});

// =========================== Program mqtt sebelumnya & Berhasil =============================================

// mqttClient.on('message', async (topic, message) => {
//   // message is a Buffer
//   const dataKontrol = JSON.parse(message.toString());
//   if(JSON.stringify(dataKontrol) !== JSON.stringify(lastReceivedData)){
//     lastReceivedData = dataKontrol;
//     try {
//       const data = await prisma.dataKontrols.create({
//           data:{
//               suhu : dataKontrol.suhu,
//               volume : dataKontrol.volume,
//               ppm_before : dataKontrol.ppm_before,
//               ppm_after : dataKontrol.ppm_after,
//               selisih : dataKontrol.selisih,
//               Vnutrisi : dataKontrol.Vnutrisi,
//               active_pump : dataKontrol.active_pump,
//               setpoint : dataKontrol.setpoint
//           }
//       });
//       console.log('Data saved to database:', data);
//     } catch (error) {
//       console.error('Failed to save data:', error);
//     }
//   }

// });
mqttClient.on("message", async (topic, message) => {
  const data = JSON.parse(message.toString()); // Parsing data JSON

  if (topic === "skripsi/dataKontrol/POPNpHBIoTBVLN") {
    dataKontrols = {
      suhu: data.suhu,
      volume: data.volume,
      ppm_before: data.ppm_before,
      ppm_after: data.ppm_after,
      selisih: data.selisih,
      Vnutrisi: data.Vnutrisi,
      active_pump: data.active_pump,
      setpoint: data.setpoint,
    };

    try {
      await prisma.dataKontrols.create({
        data: dataKontrols,
      });
      console.log(
        "Latest data from skripsi/monitoring/POPNpHBIoTBVLN saved to database"
      );

      // Clear the buffer after saving
      dataKontrols = null;
    } catch (error) {
      console.error("Error saving topik2 data:", error);
    }
    // Simpan data langsung ke database dari topik 1
  } else if (topic === "skripsi/monitoring/POPNpHBIoTBVLN") {
    // Simpan data terbaru dari topik 2 ke buffer
    dataMonitoring = {
      ppm: data.ppm,
      suhu: data.suhu,
      volume: data.volume,
    };
  }
});

async function saveDataMonitoring() {
  if (dataMonitoring) {
    try {
      await prisma.dataMonitoring.create({
        data: dataMonitoring,
      });
      console.log(
        "Latest data from skripsi/monitoring/POPNpHBIoTBVLN saved to database"
      );

      // Clear the buffer after saving
      dataMonitoring = null;
    } catch (error) {
      console.error("Error saving topik2 data:", error);
    }
  } else {
    console.log("No new data from topik2 to save");
  }
}

cron.schedule("0 * * * *", saveDataMonitoring);

app.listen(process.env.APP_PORT, () => {
  console.log("server up and running");
});
