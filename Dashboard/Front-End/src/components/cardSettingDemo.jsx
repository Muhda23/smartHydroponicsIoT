import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mqtt from 'mqtt';

const CardSettingDemo = () => {
  const [setpoint_atas, setSetpointAtas] = useState("");
  const [setpoint_bawah, setSetpointBawah] = useState("");
  const [panjang, setPanjang] = useState("");
  const [lebar, setLebar] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [flowrate, setFlowrate] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const getParamsById = async () => {
      const response = await axios.get('http://localhost:5000/parameters/1');
      setSetpointAtas(response.data.setpoint_atas);
      setSetpointBawah(response.data.setpoint_bawah);
      setPanjang(response.data.panjang);
      setLebar(response.data.lebar);
      setTinggi(response.data.tinggi);
      setFlowrate(response.data.flowrate);
    };
    
    getParamsById();
  }, []);

  const options = {
    clean: true,
    connectTimeout: 4000,
    clientId: 'TATest',
    username: 'taTest',
    password: '',
  };

  const publishData = async (data) => {
    const jsonData = JSON.stringify(data);
    const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt'); //(ws://mqtt.lonelybinary.com:9001/mqtt)

    client.on('connect', () => {
      console.log('Connected to Broker');
      client.publish('skripsi/parameters/POPNpHBIoTBVLN', jsonData, {}, (err) => { 
        if (err) {
          console.error('Publish error:', err);
        } else {
          console.log('Data sent:', jsonData);
        }
        client.end();
      });
    });
  };

  const updateParams = async (e) => {
    e.preventDefault();

    const updatedData = {
      setpoint_atas: parseInt(setpoint_atas),
      setpoint_bawah: parseInt(setpoint_bawah),
      panjang: parseFloat(panjang),
      lebar: parseFloat(lebar),
      tinggi: parseFloat(tinggi),
      flowrate: parseInt(flowrate),
    };

    try {
      await axios.patch('http://localhost:5000/parameters/1', updatedData);
      await publishData(updatedData);
      navigate("/");
    } catch (error) {
      console.error('Error updating parameters:', error);
    }
  };

  return (
    <div className="bg-slate-100 flex items-center">
      <div className="w-2/3 bg-grey-400 mx-auto">
        <h1 className="text-center font-bold py-10">Settings Your Hydroponic Parameters</h1>
        <div className="flex items-center w-full justify-center">
          <form className="w-full" onSubmit={updateParams}>
            <div className="flex flex-wrap -mx-3 mb-6 bg-slate-200 rounded-lg">
              <div className="flex items-center justify-end font-bold w-1/3">
                <h5>Setpoint (ppm)</h5>
              </div>
              <div className="flex flex-grow w-2/3 gap-x-4 justify-start px-2">
                <div>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2" htmlFor="setpointAtas">
                    Setpoint Atas
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    id="setpointAtas"
                    value={setpoint_atas}
                    onChange={(e) => setSetpointAtas(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2" htmlFor="setpointBawah">
                    Setpoint Bawah
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={setpoint_bawah}
                    onChange={(e) => setSetpointBawah(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="flex items-center justify-end font-bold w-1/3 bg-slate-300">
                <h5 className="bg-slate-200">Volume Box Media (meter)</h5>
              </div>
              <div className="flex flex-grow w-2/3 gap-x-4 justify-start px-3 bg-slate-400">
                <div>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2" htmlFor="panjang">
                    Panjang
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={panjang}
                    onChange={(e) => setPanjang(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2" htmlFor="lebar">
                    Lebar
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={lebar}
                    onChange={(e) => setLebar(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2" htmlFor="tinggi">
                    Tinggi
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={tinggi}
                    onChange={(e) => setTinggi(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="flex items-center justify-end font-bold w-1/3 bg-slate-300">
                <h5 className="bg-slate-200">Flow Rate Pompa (ml/s)</h5>
              </div>
              <div className="flex flex-grow w-2/3 gap-x-4 justify-start px-3 bg-slate-400">
                <div>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2" htmlFor="flowrate">
                    Pompa
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={flowrate}
                    onChange={(e) => setFlowrate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CardSettingDemo;
