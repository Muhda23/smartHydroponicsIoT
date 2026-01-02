import Card from "../components/card";
import TabelDataControl from "../components/tabelDataControl";
import GrafikSuhu from "../components/graphSuhu"
import GrafikPPM from "../components/graphPPM"
import GrafikVolume from "../components/graphVolume"
import { useState, useEffect } from "react";
import mqtt from "mqtt";
import nutrition from '../assets/nutrition.png';
import waterTemp from '../assets/waterTemp.png';
import waterVolume from '../assets/waterVolume.png';

const HomePage = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const client = mqtt.connect("ws://broker.emqx.io:8083/mqtt");
    client.on("connect", () => {
      console.log("Connected to Broker");
      client.subscribe("skripsi/monitoring/POPNpHBIoTBVLN", (err) => {
        if (err) {
          console.error("Subcribe error:", err);
        } else {
          console.log("Subscribe Succed");
        }
      });
    });
    
    client.on('message',(topic,  message)=>{
      // try {
        const jsonData = message.toString();
        console.log(`Pesan diterima dari ${topic}: ${jsonData}`);
  
        // Parsing JSON
        const parsedData = JSON.parse(jsonData);

        // Menyimpan data ke dalam state
        setData(parsedData);
      // } catch (error) {
      //   console.error("Error parsing JSON Topic3", error);
      // }
    })

  },[]);

  return (
    <div >
      <div className="flex justify-around justify-center py-8 gap-10 mx-10 px-5">
        <Card params={"Konsentrasi Nutrisi"} value={838} cap={"ppm"} gambar={nutrition}/>{" "} {/*data.ppm*/}
        {/* value = {parseData.ppm} */}
        <Card params={"Suhu Media"} value={26} cap={"Celcius"} gambar ={waterTemp}/>{" "} {/*data.suhu*/}
        {/* value = {parseData.suhu} */}
        <Card params={"Volume Media"} value={36.8} cap={"Liter"} gambar ={waterVolume}/>{" "} {/*data.volume*/}
        {/* value = {parseData.volume} */}
      </div>
      <div className="flex flex-col justify-around items-center">
      <GrafikSuhu ></GrafikSuhu>
      <GrafikPPM ></GrafikPPM>
      <GrafikVolume ></GrafikVolume>
      </div>
      <div>
      </div>
    </div>
  );
};

export default HomePage;
