import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts } from './redux/contactsOperations';
import { selectIsLoading, selectError } from './redux/selectors';
import { ContactForm } from './components/ContactForm/ContactForm';
import { ContactList } from './components/ContactList/ContactList';
import { Filter } from './components/Filter/Filter';
import { Loader } from './components/Loader/Loader';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import styles from './App.module.css';

export const App = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📱 Phonebook</h1>
      <ContactForm />

      <h2 className={styles.subtitle}>Contacts</h2>
      <Filter />

      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && <ContactList />}
    </div>
  );
};
