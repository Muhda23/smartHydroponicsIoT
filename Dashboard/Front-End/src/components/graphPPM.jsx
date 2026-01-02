import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; // Import Line chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Ticks } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

const GrafikPPM = () => {

  const [ppmData, setPPMData] = useState([]);
  const [labels, setLabels] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      // Gantikan URL dengan API atau sumber data yang sesuai
      const response = await fetch('http://localhost:5000/DataMonitoring');
      const data = await response.json();
      
      // Memperbarui data ppm dan label untuk grafik
      setPPMData(data.map((item) => item.ppm)); // Sesuaikan dengan struktur data ppm Anda
      setLabels(data.map((item) => formatToWIB(item.monitoringAt))); // Sesuaikan dengan field waktu Anda
    };

    fetchData();

    const formatToWIB = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    };

    // Mengatur interval untuk memperbarui data setiap 5 detik (atau sesuai kebutuhan)
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // 5000ms = 5 detik

    // Hentikan interval saat komponen unmount
    return () => clearInterval(intervalId);
  }, []);

  // Data untuk grafik Chart.js
  const data = {
    labels: labels, // Labels waktu untuk sumbu X
    datasets: [
      {
        label: 'Nutrisi (ppm)',
        data: ppmData, // Data ppm untuk sumbu Y
        borderColor: 'rgba(75,192,192,1)', // Warna garis grafik
        backgroundColor: 'rgba(75,192,192,0.2)', // Warna latar belakang titik
        tension: 0.1, // Kelengkungan garis
      },
    ],
  };

  // Opsi konfigurasi untuk grafik
  const options = {
    responsive: true,
    plugins: {
      annotation: {
        annotations: [
          {
            // Area Highlight antara 800ppm dan 840ppm
            type: 'box',
            yMin: 800,
            yMax: 840,
            backgroundColor: 'rgba( 127, 255, 212, 0.2 )',
            borderColor: 'rgba(3, 201, 169,1)',
            borderWidth: 1,

          },
        ],
      },
      title: {
        display: true,
        text: 'Data Nutrisi',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.raw + ' PPM'; // Menampilkan suhu dengan satuan °C
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Waktu',
        },
      },
      y: {
        min:0,
        max:1000,
        ticks: {
          stepSize:100
        },
        title: {
          display: true,
          text: 'Nutrisi (ppm)',
        }
      }
    },
  };

  return (
    <div style={{height: '50vh', width: '60vw'}} className='content-center justify-items-center rounded-lg border-2 border-gray-200 shadow-lg mt-2'>
      {/* <h2>Suhu</h2> */}
      <Line data={data} options={options} />
    </div>
  );
};

export default GrafikPPM;
