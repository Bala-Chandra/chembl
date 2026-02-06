import { Outlet } from 'react-router-dom';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1>ChEMBL Explorer</h1>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} ChEMBL
      </footer>
    </div>
  );
}
