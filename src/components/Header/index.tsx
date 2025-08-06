import { IoIosAddCircleOutline } from "react-icons/io";
import styles from "./styles.module.css";
import { CiSettings } from "react-icons/ci";
import { HiDotsVertical } from "react-icons/hi";
import { GiNothingToSay } from "react-icons/gi";

export function Header({ setModalAddbutton, setModalConfigbutton }) {
  const openeModal = () => {
    setModalAddbutton(true);
  };
  const openeModalConfig = () => {
    setModalConfigbutton(true);
  };
  return (
    <div className={styles.headerMenu}>
      <div>
        <a href="">
          <h1>
            {" "}
            <GiNothingToSay />
            <div style={{ marginTop: "-3px" }}>Chisay</div>
          </h1>
        </a>
      </div>
      <div className={styles.MenuIcons}>
        <a onClick={openeModal} className={styles.button}>
          {" "}
          <IoIosAddCircleOutline /> <div>Add Phrase</div>
        </a>
        <a
          onClick={openeModalConfig}
          className={styles.button}
          className={styles.button}
        >
          {" "}
          <CiSettings /> <div>Setting</div>
        </a>
        <a className={styles.button}>
          {" "}
          <HiDotsVertical />
        </a>
      </div>
    </div>
  );
}
