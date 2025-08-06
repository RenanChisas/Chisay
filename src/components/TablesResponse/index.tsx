import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import type { dataSave } from "../../props/dataSaveProps";
type TablesResponseProps = {
  dataSave: dataSave;
};

export function TablesResponse({ dataSave }: TablesResponseProps) {
  const [showResponse, setShowResponse] = useState(false);
  useEffect(() => {
    console.log("📦 dataSave updated in TablesResponse:", dataSave);
  }, [dataSave]);

  const showAnswers = () => {
    setShowResponse((prev) => !prev);
  };

  return (
    <>
      <button className={styles.button} onClick={showAnswers}>
        {showResponse ? <p>Hide answers</p> : <p>Show answers</p>}
      </button>
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>User Phrase</th>
              <th>Correct Phrase</th>
            </tr>
          </thead>
          <tbody>
            {dataSave.table.map((row, index) =>
              showResponse ? (
                <tr
                  key={index}
                  className={`${styles.tableLine} ${
                    row[2] ? styles.correct : styles.error
                  }`}
                >
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ) : (
                <tr key={index} style={{ backgroundColor: "grey" }}>
                  <td>-. --- / .- -. ... .-- . .-.</td>
                  <td>-. --- / .- -. ... .-- . .-.</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
