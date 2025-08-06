import { useEffect, useState } from "react";
import { PhraseStorage } from "../../PhraseStorage/PhraseStorage.ts";
import styles from "./styles.module.css";

export function ModalConfig({ setModalConfigbutton }) {
  const [phrase, setPhrase] = useState("");
  const [wordsinput, setwordsinput] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [whichDB, setwhichDB] = useState(0);
  const [timer, setTimer] = useState(100);

  const [minutes, setMinutes] = useState<number | "">(30);

  useEffect(() => {
    const time = PhraseStorage.getAll(2);
    const seconds = time[0];

    console.log("Loaded time (seconds):", seconds);

    if (seconds !== undefined) {
      setTimer(seconds);
      const minutes = Math.floor(seconds / 60);
      setMinutes(minutes);
    }
  }, []);

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;

    if (val === "") {
      setMinutes("");
      return;
    }

    if (/^\d+$/.test(val)) {
      const num = Number(val);
      if (num >= 0 && num <= 999) {
        setMinutes(num);
      }
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    setwordsinput(
      phrase
        .split(" ")
        .map((word) => word.trim())
        .filter((word) => word.length)
        .join(",")
    );
  }, [phrase]);

  useEffect(() => {
    setWords(
      wordsinput
        .split(",")
        .map((word) => word.trim())
        .filter((word) => word.length > 0)
    );
  }, [wordsinput]);

  const closeModal = () => {
    const seconds = Math.floor(minutes * 60);
    PhraseStorage.updateAt(0, seconds, 2);

    setModalConfigbutton(false);
  };
  const cleanData = () => {
    PhraseStorage.clear(0);
    window.location.reload();
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <div className={styles.titleCont}>
          <div className={styles.title}>
            <h1>Settings</h1>
          </div>
          <div className={styles.titleCloseBtn}>
            <button onClick={closeModal}>X</button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.inputs}>
            <label>Timer(Minutes)</label>
            <input
              type="number"
              min={0}
              placeholder="30"
              value={minutes}
              onChange={handleMinutesChange}
              maxLength={3}
              pattern="\d{1,3}"
            />
          </div>
          <div className={styles.cleanDB}>
            <label>Data</label>
            <button onClick={cleanData}>Clean All Data</button>
            <div className={styles.importDB}>
              <button>Export Data</button>
              <button>Import Data</button>
            </div>
          </div>
          <div></div>
        </div>
        <div className={styles.footer}>
          <button className={styles.clButton} onClick={closeModal}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
