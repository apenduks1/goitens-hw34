import styles from './Loader.module.css';

export const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p className={styles.text}>Loading...</p>
    </div>
  );
};
