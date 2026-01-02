import React from "react";
import axios from "axios";
import useSWR from "swr";

const TabelDataControl = () => {
  const dataFetcher = async () => {
    const response = await axios.get("http://localhost:5000/DataKontrols");
    return response.data;
  };

  const { data } = useSWR("datakontrols", dataFetcher);
  if (!data) return <h2>Loading ...</h2>;

  // Fungsi untuk mengonversi waktu ke WIB
  const formatToWIB = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  };

  return (
    <div className="flex flex-col mt-5 mx-auto">
      <div className="container px-4">
        <article className="relative shadow rounded-lg mt-3 ">
          <table className="w-full text-small text-left text-grey-500">
            <thead className="text-xs text-center text-grey-700 uppercase bg-gray-200">
              <tr>
                <th className="py-3">No</th>
                <th className="py-3 px-1">Suhu</th>
                <th className="py-3 px-1">Volume</th>
                <th className="py-3 px-1">ppm_before</th>
                <th className="py-3 px-1">ppm_after</th>
                <th className="py-3 px-1">Selisih</th>
                <th className="py-3 px-1">Vnutrisi</th>
                <th className="py-3 px-1">Durasi</th>
                <th className="py-3 px-1">Setpoint</th>
                <th className="py-3 px-1">Date & Time</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data.map((datakontrols, index) => (
                <tr key={datakontrols.id}>
                  <td>{index + 1}</td>
                  <td>{datakontrols.suhu}</td>
                  <td>{datakontrols.volume}</td>
                  <td>{datakontrols.ppm_before}</td>
                  <td>{datakontrols.ppm_after}</td>
                  <td>{datakontrols.selisih}</td>
                  <td>{datakontrols.Vnutrisi}</td>
                  <td>{datakontrols.active_pump}</td>
                  <td>{datakontrols.setpoint}</td>
                  {/* Menggunakan fungsi formatToWIB untuk menampilkan waktu sesuai WIB */}
                  <td>{formatToWIB(datakontrols.controlAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </div>
  );
};

export default TabelDataControl;



// import React from "react";
// import axios from "axios";
// import useSWR from "swr";


// const TabelDataControl = () => {

//   const dataFetcher = async () => {
//     const response = await axios.get("http://localhost:5000/DataKontrols");
//     return response.data;
//   };

//   const { data } = useSWR("datakontrols", dataFetcher);
//   if (!data) return <h2>Loading ...</h2>;
//   return (
//     <div className="flex flex-col mt-5 mx-auto">
//       <div className="container px-4">
//         <article className="relative shadow rounded-lg mt-3 ">
//           <table className="w-full text-small text-left text-grey-500">
//             <thead className="text-xs text-center text-grey-700 uppercase bg-gray-200">
//               <tr>
//                 <th className="py-3">No</th>
//                 <th className="py-3 px-1">Suhu</th>
//                 <th className="py-3 px-1">Volume</th>
//                 <th className="py-3 px-1">ppm_before</th>
//                 <th className="py-3 px-1">ppm_after</th>
//                 <th className="py-3 px-1">Selisih</th>
//                 <th className="py-3 px-1">Vnutrisi</th>
//                 <th className="py-3 px-1">Durasi</th>
//                 <th className="py-3 px-1">Setpoint</th>
//                 <th className="py-3 px-1">Date & Time</th>
//               </tr>
//             </thead>
//             <tbody className="text-center">
//               {data.map((datakontrols, index) => (
//                 <tr key={datakontrols.id}>
//                   <td>{index + 1}</td>
//                   <td>{datakontrols.suhu}</td>
//                   <td>{datakontrols.volume}</td>
//                   <td>{datakontrols.ppm_before}</td>
//                   <td>{datakontrols.ppm_after}</td>
//                   <td>{datakontrols.selisih}</td>
//                   <td>{datakontrols.Vnutrisi}</td>
//                   <td>{datakontrols.active_pump}</td>
//                   <td>{datakontrols.setpoint}</td>
//                   <td>{datakontrols.controlAt}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </article>
//       </div>
//     </div>
//   );
// };

// export default TabelDataControl;
