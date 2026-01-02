import React from 'react';
//import '..assets/footer.css'; // Import file CSS untuk styling

const Footer = () => {
  return (
    <footer style={{backgroundColor: 'FFF6E9', textAlign: 'center', padding: '20px', bottom: '0', width: '100%'}}>
      <div style={{fontSize: '1rem'}}>
        {/* <p>Penelitian ini merupakan hasil karya sendiri dan belum pernah dipublikasikan sebelumnya</p> */}
        <p>[Muhammad Ulil Huda], [2010501066] | Penelitian ini merupakan hasil karya sendiri dan belum pernah dipublikasikan sebelumnya. Dibuat sebagai syarat untuk menyelesaikan tugas akhir.</p>
        <p>Jurusan Teknik Elektro, Fakultas Teknik, Universitas Tidar</p>
        <p>&copy; 2024 To-Tech.</p>
      </div>
    </footer>
  );
};

export default Footer;
