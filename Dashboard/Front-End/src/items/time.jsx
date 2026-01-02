import React, { useState, useEffect } from 'react';

const DateTime = () => {
  // State untuk menyimpan tanggal dan waktu saat ini
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    // Fungsi untuk memperbarui tanggal dan waktu setiap detik
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    // Membersihkan interval ketika komponen di-unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format tanggal dan waktu menggunakan bahasa Indonesia (id-ID)
  const formattedDate = dateTime.toLocaleDateString('id-ID', {
    weekday: 'long', // Nama hari (misalnya: Senin, Selasa)
    year: 'numeric', // Tahun (misalnya: 2024)
    month: 'long', // Nama bulan (misalnya: Januari, Februari)
    day: 'numeric', // Hari (misalnya: 12)
  });

  const formattedTime = dateTime.toLocaleTimeString('id-ID', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Menggunakan format 12 jam (AM/PM)
  });

  return (
    <div className='flex justify-end px-8 '>
      <h1 className='px-3'>{formattedDate}</h1>
      <h2>{formattedTime}</h2>
    </div>
  );
};

const App = () => (
  <div>
    <DateTime />
  </div>
);

export default DateTime;
