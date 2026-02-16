import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { setFilter } from '../../redux/filterSlice';
import { selectFilter } from '../../redux/selectors';
import styles from './Filter.module.css';

export const Filter = () => {
  const dispatch = useDispatch();
  const filter = useSelector(selectFilter);

  const handleFilterChange = e => {
    dispatch(setFilter(e.target.value));
  };

  return (
    <div className={styles.filterContainer}>
      <label className={styles.label}>
        Find contacts by name
        <input
          className={styles.input}
          type="text"
          value={filter}
          onChange={handleFilterChange}
        />
      </label>
    </div>
  );
};

Filter.propTypes = {};
