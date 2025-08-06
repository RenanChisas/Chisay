import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { Content } from "./components/Content";
import { Header } from "./components/Header";
import { TablesResponse } from "./components/TablesResponse";
import { ModalAdd } from "./components/ModalAdd";
import { ModalConfig } from "./components/ModalConfig";
import { PhraseStorage } from "./PhraseStorage/PhraseStorage";

function App() {
  const [ModalAddbutton, setModalAddbutton] = useState(false);
  const [ModalConfigbutton, setModalConfigbutton] = useState(false);
  const [dataSave, setDataSave] = useState({ table: [], time: null });

  useEffect(() => {
    const time = PhraseStorage.getAll(2);
    if (time.length === 0) {
      PhraseStorage.add(180, 2);
    }
  }, []);

  useEffect(() => {
    console.log(ModalAddbutton);
  }, [ModalAddbutton]);
  return (
    <>
      <div className={styles.home}>
        <Header
          setModalAddbutton={setModalAddbutton}
          setModalConfigbutton={setModalConfigbutton}
        />
        <Content dataSave={dataSave} setDataSave={setDataSave} />
      </div>
      <div className={styles.table}>
        <TablesResponse dataSave={dataSave} setDataSave={setDataSave} />
      </div>
      {ModalAddbutton ? <ModalAdd setModalAddbutton={setModalAddbutton} /> : ""}
      {ModalConfigbutton ? (
        <ModalConfig setModalConfigbutton={setModalConfigbutton} />
      ) : (
        ""
      )}
    </>
  );
}

export default App;
