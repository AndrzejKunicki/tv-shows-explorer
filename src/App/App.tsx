import styles from './App.module.css';
import { SearchPage } from './SearchPage/SearchPage';

export const App = () => (
  <main className={styles.app}>
    <h1 className={styles.title}>TV Shows Explorer</h1>
    <SearchPage />
  </main>
);
