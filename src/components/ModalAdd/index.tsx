import { useEffect, useState } from "react";
import { PhraseStorage } from "../../PhraseStorage/PhraseStorage.ts";
import styles from "./styles.module.css";
import type { phraseProps } from "../../props/phraseProps.ts";

type ModalAddProps = {
  setModalAddbutton: (value: boolean) => void;
};

export function ModalAdd({ setModalAddbutton }: ModalAddProps) {
  const [phrase, setPhrase] = useState("");
  const [wordsinput, setwordsinput] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [whichDB] = useState(0);

  const handleChangePhrase = (event: { target: { value: string } }) => {
    setPhrase(event.target.value.toUpperCase());
  };
  const handleChangewordsinput = (event: { target: { value: string } }) => {
    setwordsinput(event.target.value.toUpperCase());
  };

  const addPhrase = () => {
    const dataDB = PhraseStorage.getAll(0);
    const lastId =
      dataDB.length > 0
        ? Math.max(...dataDB.map((item: phraseProps) => item.id ?? 0))
        : 0;
    const nextId = lastId + 1;
    if (phrase) {
      PhraseStorage.add(
        {
          id: nextId,
          phrase: phrase,
          words: words,
          qtdWord: phrase.trim().split(/\s+/).length,
          difficulty: 999,
        },
        whichDB
      );
    }
    setModalAddbutton(false);
    window.location.reload();
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
    setModalAddbutton(false);
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <div className={styles.titleCont}>
          <div className={styles.title}>
            <h1>Add Phrase</h1>
          </div>
          <div className={styles.titleCloseBtn}>
            <button onClick={closeModal}>X</button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.inputs}>
            <label>Sentence</label>
            <input
              placeholder="I HATE ENGLISH"
              type="text"
              value={phrase}
              onChange={handleChangePhrase}
            />
          </div>
          <div className={styles.inputs}>
            <label>words</label>
            <input
              placeholder="I,HATE, DO, DOES, ENGLISH"
              type="text"
              value={wordsinput}
              onChange={handleChangewordsinput}
            />
          </div>
          <div className={styles.words}>
            {words.map((word) => (
              <div>
                <p> {word}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.clButton} onClick={closeModal}>
            Cancel
          </button>
          <button className={styles.cfButton} onClick={addPhrase}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
