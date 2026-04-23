import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.css";
import { useAuth } from "../auth/AuthContext";
import { useLocation } from "react-router-dom";
import { useSearch } from "../search/useSearch";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { counts } = useSearch();

  const showCounts = location.pathname === "/results" && counts;

  return (
    <div className={styles.layout}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>ChEMBL Explorer</h1>
        </div>

        <div className={styles.headerRight}>
          {user && (
            <>
              <span className={styles.userEmail}>{user.email}</span>
              <button className={styles.logoutBtn} onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {showCounts && counts && (
        <div className={styles.countBar}>
          <span>Structures: {counts.structures}</span>
          <span>Documents: {counts.documents}</span>
          <span>Assays: {counts.assays}</span>
          <span>Activities: {counts.activities}</span>
        </div>
      )}

      {/* MAIN */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} ChEMBL
      </footer>
    </div>
  );
}
