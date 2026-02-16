import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteContact } from '../../redux/contactsOperations';
import { selectIsLoading } from '../../redux/selectors';
import styles from './ContactItem.module.css';

export const ContactItem = ({ contact }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const handleDelete = () => {
    dispatch(deleteContact(contact.id));
  };

  return (
    <li className={styles.item}>
      <span className={styles.name}>{contact.name}:</span>
      <span className={styles.phone}>{contact.phone}</span>
      <button
        className={styles.button}
        type="button"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? 'Deleting...' : 'Delete'}
      </button>
    </li>
  );
};

ContactItem.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
};
