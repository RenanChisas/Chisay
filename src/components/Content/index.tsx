import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { PhraseStorage } from "../../PhraseStorage/PhraseStorage.ts";
import type { phraseProps } from "../../props/phraseProps.ts";
import type { dataSave } from "../../props/dataSaveProps.ts";

type ContentProps = {
  dataSave: dataSave;
  setDataSave: React.Dispatch<React.SetStateAction<dataSave>>;
};

type WordItem = {
  word: string;
  active: boolean;
};

export function Content({ dataSave, setDataSave }: ContentProps) {
  const [start, setStart] = useState(false);
  const [timer, setTimer] = useState(100);
  const [phrase, setPhrase] = useState<(phraseProps | string)[]>([]);
  const [words, setWords] = useState<WordItem[]>([]);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [dataDB, setdataDB] = useState<phraseProps[]>([]);
  const [whichDB] = useState(0);

  useEffect(() => {
    const tempDB = PhraseStorage.getAll(whichDB);
    tempDB.sort(
      (a: { difficulty: number }, b: { difficulty: number }) =>
        b.difficulty - a.difficulty
    );
    const time = PhraseStorage.getAll(2);
    const seconds = time[0];
    setTimer(seconds);
    setdataDB(tempDB);
    choosePhrase();
  }, [start]);

  function shuffle(array: WordItem[]) {
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
    setDataSave((prev: dataSave) =>
      addToTable(prev, phraseString, phraseCheck, correct)
    );

    console.log("Saved:", { phraseString, phraseCheck, correct });
  };

  function addToTable(
    prev: dataSave,
    phraseString: string,
    phraseCheck: string,
    correct: boolean
  ): dataSave {
    return {
      ...prev,
      table: [...prev.table, [phraseString, phraseCheck, correct]],
    };
  }

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
    console.log(count);
    if (index < dataDB.length) {
      setCount((prev) => prev + value);
    }
  };
  const addOrRemoveWord = (index: number) => {
    const word = words[index]?.word;
    if (!word) return;

    setPhrase((prevPhrase) => {
      if (words[index]?.active) {
        changeCount(-1);
        const firstIndex = prevPhrase.indexOf(word);
        if (firstIndex === -1) return prevPhrase;

        return [
          ...prevPhrase.slice(0, firstIndex),
          ...prevPhrase.slice(firstIndex + 1),
        ];
      } else {
        changeCount(1);
        return [...prevPhrase, word];
      }
    });
  };

  const activeWord = (indexToToggle: number) => {
    setWords((prevWords) =>
      prevWords.map((item, index) =>
        index === indexToToggle ? { ...item, active: !item.active } : item
      )
    );

    addOrRemoveWord(indexToToggle);
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
                onClick={() => activeWord(index)}
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
