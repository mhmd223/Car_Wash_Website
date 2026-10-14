import styles from "./header.module.css";

export default function Header({ username }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.h1}>Welcome {username}!</h1>
    </header>
  );
}
