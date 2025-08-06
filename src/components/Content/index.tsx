import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { PhraseStorage } from "../../PhraseStorage/PhraseStorage.ts";

export function Content({ dataSave, setDataSave }) {
  const [start, setStart] = useState(false);
  const [timer, setTimer] = useState(100);
  const [phrase, setPhrase] = useState([]);
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [dataDB, setdataDB] = useState([]);
  const [whichDB, setwhichDB] = useState(0);

  useEffect(() => {
    const tempDB = PhraseStorage.getAll(whichDB);
    tempDB.sort((a, b) => b.difficulty - a.difficulty);
    const time = PhraseStorage.getAll(2);
    const seconds = time[0];
    setTimer(seconds);
    setdataDB(tempDB);
    choosePhrase();
  }, [start]);

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const choosePhrase = () => {
    setPhrase([]);
    setWords(() => {
      const wordsArray = dataDB[index]?.words || [];
      const newWords = wordsArray.map((word) => ({
        word: word,
        active: false,
      }));

      return shuffle(newWords);
    });
  };
  useEffect(() => {
    choosePhrase();
  }, [index]);

  useEffect(() => {
    const currentData = dataDB[index];

    if (currentData && currentData.qtdWord && count === currentData.qtdWord) {
      const timer = setTimeout(() => {
        if (index < dataDB.length - 1) {
          setIndex((prev) => prev + 1);
        } else {
          reset();
        }
        setCount(0);
        saveData();
        console.log(dataSave);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [count, index]);

  const saveData = () => {
    const phraseString = formatPhrase().trim();
    const phraseCheck = dataDB[index].phrase.trim();

    const cleanUserPhrase = phraseString.replace(/\s+/g, "").toUpperCase();
    const cleanCorrectPhrase = phraseCheck.replace(/\s+/g, "").toUpperCase();

    const correct = cleanUserPhrase === cleanCorrectPhrase;
    const auxItem = { ...dataDB[index] };

    const auxDB = PhraseStorage.getAt(auxItem.id - 1, whichDB);
    if (correct) {
      if (auxDB.difficulty > 998) {
        auxDB.difficulty = 0;
      } else if (auxDB.difficulty > 0) {
        auxDB.difficulty -= 10;
      }
      PhraseStorage.updateAt(auxDB.id - 1, auxDB, 0);
    } else {
      auxDB.difficulty += 10;
      PhraseStorage.updateAt(auxDB.id - 1, auxDB, 0);
    }
    setDataSave((prev) => ({
      ...prev,
      table: [...prev.table, [phraseString, phraseCheck, correct]],
    }));

    console.log("Saved:", { phraseString, phraseCheck, correct });
  };

  const startHandle = () => {
    const tempDB = PhraseStorage.getAll(whichDB);
    choosePhrase();
    if (tempDB.length > 0) {
      console.log(tempDB);
      setDataSave({ table: [], time: null });
      setStart((prev) => !prev);
    } else {
      alert("no registered phrase");
    }
  };
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = seconds.toString().padStart(2, "0");
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  const formatPhrase = () => {
    let formatedPhrase = "";
    phrase.map((word, index) => {
      if (index > 0) {
        formatedPhrase += " ";
      }
      formatedPhrase += word;
    });
    return formatedPhrase;
  };
  const changeCount = (value: number) => {
    if (index < dataDB.length) {
      setCount((prev) => prev + value);
    }
  };
  const addOrRemoveWord = (word: string) => {
    setPhrase((prev) => {
      if (prev.includes(word)) {
        changeCount(-1);
        return prev.filter((w) => w !== word);
      } else {
        changeCount(+1);
        return [...prev, word];
      }
    });
  };

  const activeWord = (indexToToggle, word) => {
    setWords((prevWords) =>
      prevWords.map((item, index) =>
        index === indexToToggle ? { ...item, active: !item.active } : item
      )
    );

    addOrRemoveWord(word);
  };

  const reset = () => {
    setIndex(0);
    setCount(0);
    setWords([]);
    setPhrase([]);
    setTimer(100);
    setStart(false);
  };

  useEffect(() => {
    if (timer <= 0) {
      reset();
    }

    const timerAux = setTimeout(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerAux);
  }, [timer]);

  return (
    <>
      {!start ? (
        <div className={styles.start}>
          <button onClick={startHandle}>START</button>
        </div>
      ) : (
        <div className={styles.content}>
          <h1>{formatTimer()}</h1>
          <div className={styles.phrase}>
            <h1>{formatPhrase()}</h1>
          </div>
          <div className={styles.options}>
            {words.map((item, index) => (
              <button
                key={index}
                onClick={() => activeWord(index, item.word)}
                className={`${styles.buttonWord} ${
                  item.active ? styles.active : ""
                }`}
              >
                {item.word}
              </button>
            ))}
          </div>
        </div>
      )}{" "}
    </>
  );
}
