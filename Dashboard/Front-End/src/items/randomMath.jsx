import React, { useState, useEffect } from 'react';

const RandomTemperature = () => {
  const [temperature, setTemperature] = useState(0);

  // Fungsi untuk menghasilkan suhu acak
  const generateRandomTemperature = () => {
    return (Math.random() * 30 + 10).toFixed(1); // Suhu acak antara 10°C dan 40°C
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTemperature(generateRandomTemperature());
    }, 1000); // Mengupdate setiap 1 detik

    // Membersihkan interval saat komponen di-unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>{temperature}</h1>
    </div>
  );
};

export default RandomTemperature;
