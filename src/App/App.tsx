import styles from './App.module.css';
import { Backdrop } from './Backdrop/Backdrop';
import { SearchPage } from './SearchPage/SearchPage';

export const App = () => (
  <>
    <Backdrop />
    <main className={styles.app}>
      <SearchPage />
    </main>
  </>
);
