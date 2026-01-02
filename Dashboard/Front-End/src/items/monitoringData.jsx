import mqtt from "mqtt";

const getDataMonitoring = () => {
  const client = mqtt.connect("ws://mqtt.lonelybinary.com:9001/mqtt", options);
  const topic = ['Topik2', 'Topik3'];
  client.on("connect", () => {
    console.log("Connected to Broker");
    client.subscribe(topic, (err) => {
      if (err) {
        console.error("Subcribe error:", err);
      } else {
        console.log("Subscribe Succed");
      }
    });
  });

  client.on("message", (topic, message) => {
    switch(topic){
      case 'topic2':
        try {
          const jsonData = message.toString();
          console.log(`Pesan diterima: ${jsonData}`);
    
          // Parsing JSON
          const parsedData = JSON.parse(jsonData);
    
          // Menyimpan data ke dalam state
          setData(parsedData);
        } catch (error) {
          console.error("Error parsing JSON Topic2", error);
        };
      case 'topic3':
        try {
          const jsonData = message.toString();
          console.log(`Pesan diterima: ${jsonData}`);
    
          // Parsing JSON
          const parsedData = JSON.parse(jsonData);
    
          // Menyimpan data ke dalam state
          setData(parsedData);
        } catch (error) {
          console.error("Error parsing JSON Topic3", error);
        };
    }

  });
};
