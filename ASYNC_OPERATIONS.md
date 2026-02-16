# 📖 Пояснення асинхронних операцій

## createAsyncThunk - що це?

`createAsyncThunk` - це функція з Redux Toolkit, яка спрощує роботу з асинхронними операціями (HTTP запитами).

### Основна структура

```javascript
export const operationName = createAsyncThunk(
  'sliceName/actionType',  // Базовий тип екшену
  async (params, thunkAPI) => {
    // Асинхронна логіка
    const response = await axios.get(url);
    return response.data;
  }
);
```

## Три операції в проекті

### 1. fetchContacts - GET запит

```javascript
export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;  // Повертається масив контактів
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
```

**Що відбувається:**
1. Відправляється GET запит на `/contacts`
2. При успіху повертається `response.data`
3. При помилці повертається `error.message`

**Автоматично генеруються екшени:**
- `contacts/fetchAll/pending` - запит відправлено
- `contacts/fetchAll/fulfilled` - запит успішний
- `contacts/fetchAll/rejected` - запит з помилкою

### 2. addContact - POST запит

```javascript
export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, contact);
      return response.data;  // Повертається новий контакт з id
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
```

**Що відбувається:**
1. Приймає об'єкт `{ name, phone }`
2. Відправляє POST запит з цим об'єктом
3. MockAPI автоматично додає `id`
4. Повертається повний об'єкт контакту

**Автоматично генеруються екшени:**
- `contacts/addContact/pending`
- `contacts/addContact/fulfilled`
- `contacts/addContact/rejected`

### 3. deleteContact - DELETE запит

```javascript
export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${contactId}`);
      return contactId;  // Повертаємо id для видалення зі стану
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
```

**Що відбувається:**
1. Приймає `id` контакту
2. Відправляє DELETE запит на `/contacts/:id`
3. Повертає `id` для видалення зі стану

**Автоматично генеруються екшени:**
- `contacts/deleteContact/pending`
- `contacts/deleteContact/fulfilled`
- `contacts/deleteContact/rejected`

## Обробка в contactsSlice

### extraReducers з builder notation

```javascript
const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      // Fetch
      .addCase(fetchContacts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;  // Масив контактів
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;  // Повідомлення про помилку
      })
      // Add
      .addCase(addContact.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);  // Додаємо новий контакт
      })
      .addCase(addContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteContact.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(
          contact => contact.id !== action.payload  // Видаляємо по id
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
```

## Життєвий цикл операцій

### Додавання контакту

```
1. User натискає "Add contact"
   ↓
2. dispatch(addContact({ name: 'John', phone: '123' }))
   ↓
3. addContact.pending → isLoading = true
   ↓
4. Відправляється POST запит
   ↓
5a. Успіх → addContact.fulfilled
    - isLoading = false
    - items.push(новий контакт)
   
5b. Помилка → addContact.rejected
    - isLoading = false
    - error = "Network Error"
```

### Видалення контакту

```
1. User натискає "Delete"
   ↓
2. dispatch(deleteContact('123'))
   ↓
3. deleteContact.pending → isLoading = true
   ↓
4. Відправляється DELETE запит на /contacts/123
   ↓
5a. Успіх → deleteContact.fulfilled
    - isLoading = false
    - items = items.filter(id !== '123')
   
5b. Помилка → deleteContact.rejected
    - isLoading = false
    - error = "Network Error"
```

### Завантаження контактів

```
1. App монтується → useEffect
   ↓
2. dispatch(fetchContacts())
   ↓
3. fetchContacts.pending → isLoading = true
   ↓
4. Відправляється GET запит
   ↓
5a. Успіх → fetchContacts.fulfilled
    - isLoading = false
    - items = [контакти з сервера]
   
5b. Помилка → fetchContacts.rejected
    - isLoading = false
    - error = "Network Error"
```

## Використання в компонентах

### App.jsx - завантаження при монтуванні

```javascript
useEffect(() => {
  dispatch(fetchContacts());
}, [dispatch]);
```

### ContactForm.jsx - додавання контакту

```javascript
const handleSubmit = e => {
  e.preventDefault();
  dispatch(addContact({ name, phone }));
  setName('');
  setPhone('');
};
```

### ContactItem.jsx - видалення контакту

```javascript
const handleDelete = () => {
  dispatch(deleteContact(contact.id));
};
```

## Переваги createAsyncThunk

1. **Автоматична генерація екшенів** - pending, fulfilled, rejected
2. **Обробка помилок** - через rejectWithValue
3. **Типізація** - TypeScript підтримка
4. **Простота** - мінімум коду
5. **Стандартизація** - однаковий підхід для всіх запитів

## Порівняння з localStorage

### Було (з localStorage):
```javascript
const addContact = createSlice({
  reducers: {
    addContact: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(name, number) {
        return {
          payload: { id: nanoid(), name, number }
        };
      }
    }
  }
});
```

### Стало (з бекендом):
```javascript
const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact) => {
    const response = await axios.post(API_URL, contact);
    return response.data;  // id генерується на сервері
  }
);
```

## Основні відмінності

| Аспект | localStorage | Backend (createAsyncThunk) |
|--------|--------------|----------------------------|
| Генерація ID | Локально (nanoid) | На сервері (MockAPI) |
| Синхронність | Синхронно | Асинхронно |
| Індикатор завантаження | Не потрібен | Обов'язковий |
| Обробка помилок | Не потрібна | Обов'язкова |
| Збереження даних | Тільки локально | На сервері (доступно всім) |
| Складність | Просто | Складніше |

## Поради

1. **Завжди обробляйте всі три стани**: pending, fulfilled, rejected
2. **Використовуйте try-catch** в async функції
3. **Повертайте потрібні дані** - для fulfilled стану
4. **Використовуйте rejectWithValue** - для передачі помилок
5. **Блокуйте UI** під час isLoading - щоб уникнути подвійних запитів
