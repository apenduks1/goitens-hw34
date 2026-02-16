import PropTypes from 'prop-types';
import styles from './ErrorMessage.module.css';

export const ErrorMessage = ({ message }) => {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorText}>❌ {message}</p>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};
