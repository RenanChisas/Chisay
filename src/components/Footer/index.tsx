import styles from "./styles.module.css";

import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <div className={styles.MenuIcons}>
      <p>
        © 2025 - Todos os direitos reservados by{" "}
        <a href="https://renanchisas.work" target="_blank">
          RenanChisas
        </a>
      </p>
      <div className={styles.item}>
        <div className={styles.itemOne}>
          <a href="">
            <FaGithub size={20} />
          </a>
          <a href="https://github.com/RenanChisas" target="_blank">
            Github
          </a>
        </div>

        <div className={styles.itemOne}>
          <a href="">
            <FaLinkedin size={20} />
          </a>
          <a href="https://www.linkedin.com/in/jrenan-silva/" target="_blank">
            Linkedin
          </a>
        </div>
      </div>
    </div>
  );
}
