import TabelDataControl from "../components/tabelDataControl";
import TabelDataMonitoring from "../components/tabelMonitoring";

const SettingPage = () => {
  return (
    <div>
      <h1 className="flex justify-center pt-8 font-bold">
        {" "}
        Tabel Data Kontrol
      </h1>
      <TabelDataControl />
      <div
        style={{ width: "100vw"}}
        className="justify-items-center">
        <div style={{ width: "70vw" }}>
          <h1 className="flex justify-center pt-8 font-bold">
            {" "}
            Tabel Data Monitoing
          </h1>
          <TabelDataMonitoring />
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
