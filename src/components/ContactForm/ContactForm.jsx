import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { addContact } from '../../redux/contactsOperations';
import { selectContacts, selectIsLoading } from '../../redux/selectors';
import styles from './ContactForm.module.css';

export const ContactForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const isLoading = useSelector(selectIsLoading);

  const handleSubmit = e => {
    e.preventDefault();

    const isExist = contacts.some(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (isExist) {
      alert(`${name} is already in contacts!`);
      return;
    }


    dispatch(addContact({ name, phone }));
    setName('');
    setPhone('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Name
        <input
          className={styles.input}
          type="text"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          pattern="^[a-zA-Zа-яА-ЯіІїЇєЄ]+(([' \-][a-zA-Zа-яА-ЯіІїЇєЄ ])?[a-zA-Zа-яА-ЯіІїЇєЄ]*)*$"
          title="Name may contain only letters, apostrophe, dash and spaces."
          required
          disabled={isLoading}
        />
      </label>
      <label className={styles.label}>
        Phone
        <input
          className={styles.input}
          type="tel"
          name="phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          pattern="\+?\d{1,4}?[ .\-\s]?\(?\d{1,3}?\)?[ .\-\s]?\d{1,4}[ .\-\s]?\d{1,4}[ .\-\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          required
          disabled={isLoading}
        />
      </label>
      <button className={styles.button} type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add contact'}
      </button>
    </form>
  );
};

ContactForm.propTypes = {};
