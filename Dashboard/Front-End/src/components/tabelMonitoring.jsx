import React from "react";
import axios from "axios";
import useSWR from "swr";

const TabelDataMonitoring = () => {
  const dataFetcher = async () => {
    const response = await axios.get("http://localhost:5000/DataMonitoring");
    return response.data;
  };

  const { data } = useSWR("dataMonitoring", dataFetcher);
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
                <th className="py-3 px-1">Nutrisi</th>
                <th className="py-3 px-1">Suhu</th>
                <th className="py-3 px-1">Volume</th>
                <th className="py-3 px-1">Date & Time</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data.map((dataMonitoring, index) => (
                <tr key={dataMonitoring.id}>
                  <td>{index + 1}</td>
                  <td>{dataMonitoring.ppm}</td>
                  <td>{dataMonitoring.suhu}</td>
                  <td>{dataMonitoring.volume}</td>
                  {/* Menggunakan fungsi formatToWIB untuk menampilkan waktu sesuai WIB */}
                  <td>{formatToWIB(dataMonitoring.monitoringAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </div>
  );
};

export default TabelDataMonitoring;