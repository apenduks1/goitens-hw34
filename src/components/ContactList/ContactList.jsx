import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectFilteredContacts } from '../../redux/selectors';
import { ContactItem } from '../ContactItem/ContactItem';
import styles from './ContactList.module.css';

export const ContactList = () => {
  const filteredContacts = useSelector(selectFilteredContacts);

  if (filteredContacts.length === 0) {
    return (
      <p className={styles.emptyMessage}>
        No contacts found. Add your first contact!
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {filteredContacts.map(contact => (
        <ContactItem key={contact.id} contact={contact} />
      ))}
    </ul>
  );
};

ContactList.propTypes = {};
