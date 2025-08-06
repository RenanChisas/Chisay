import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { Content } from "./components/Content";
import { Header } from "./components/Header";
import { TablesResponse } from "./components/TablesResponse";
import { ModalAdd } from "./components/ModalAdd";

function App() {
  const [ModalAddbutton, setModalAddbutton] = useState(false);
  const [dataSave, setDataSave] = useState({ table: [], time: null });
  useEffect(() => {
    console.log(ModalAddbutton);
  }, [ModalAddbutton]);
  return (
    <>
      <div className={styles.home}>
        <Header setModalAddbutton={setModalAddbutton} />
        <Content dataSave={dataSave} setDataSave={setDataSave} />
      </div>
      <div className={styles.table}>
        <TablesResponse dataSave={dataSave} setDataSave={setDataSave} />
      </div>
      {ModalAddbutton ? <ModalAdd setModalAddbutton={setModalAddbutton} /> : ""}
    </>
  );
}

export default App;
