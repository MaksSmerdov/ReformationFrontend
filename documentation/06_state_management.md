# Управление состоянием

## Обзор системы управления состоянием

Приложение использует Redux в сочетании с Redux Toolkit для управления глобальным состоянием. Эта архитектура обеспечивает предсказуемое поведение приложения, централизованное хранение данных и упрощает отладку.

## Структура Redux-хранилища

Хранилище Redux настроено в файле `src/services/store.js`:

```jsx
import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from '@slices/projectsSlice';
import currentProjectReducer from '@slices/currentProjectSlice';
import projectTypesReducer from '@slices/projectTypesSlice';
import authReducer from '@slices/authSlice';
import usersReducer from '@slices/usersSlice';
// ... другие импорты редьюсеров

const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        projects: projectsReducer,
        currentProject: currentProjectReducer,
        projectTypes: projectTypesReducer,
        statuses: statusesReducer,
        statusGroups: statusGroupsReducer,
        users: usersReducer,
        roles: rolesReducer,
        permissions: permissionsReducer,
        // ... другие редьюсеры
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: isDevelopment ? false : true
        })
});

export default store;
```

## Слайсы Redux

Приложение использует концепцию слайсов из Redux Toolkit для организации логики управления состоянием. Каждый слайс отвечает за определенную часть состояния приложения.

### authSlice.js

Слайс для управления аутентификацией и авторизацией пользователя:

```jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';
import { getLocalStorage, setLocalStorage, clearLocalStorage, getCurrentUser } from '@services/storage';
import { defineAbilitiesFor } from '@services/ability';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/login', credentials);
        setLocalStorage('token', response.data.token);
        setLocalStorage('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await api.post('/logout');
        clearLocalStorage();
        return {};
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: getLocalStorage('token'),
        user: getCurrentUser(),
        status: 'idle',
        error: null
    },
    reducers: {
        updateAbility: (state, action) => {
            state.ability = defineAbilitiesFor(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.status = 'succeeded';
                state.ability = defineAbilitiesFor(action.payload.user);
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // ... обработка других асинхронных действий
    }
});

export const { updateAbility } = authSlice.actions;
export default authSlice.reducer;
```

### projectsSlice.js

Слайс для управления списком проектов:

```jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
    const response = await api.get('/projects');
    return response.data;
});

export const createProject = createAsyncThunk('projects/createProject', async (projectData, { rejectWithValue }) => {
    try {
        const response = await api.post('/projects', projectData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// ... другие асинхронные действия

const projectsSlice = createSlice({
    name: 'projects',
    initialState: {
        items: [],
        status: 'idle',
        error: null
    },
    reducers: {
        // ... синхронные редьюсеры
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // ... обработка других асинхронных действий
    }
});

export default projectsSlice.reducer;
```

### currentProjectSlice.js

Слайс для управления текущим выбранным проектом и его данными:

```jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const fetchCurrentProject = createAsyncThunk('currentProject/fetchCurrentProject', async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
});

export const fetchProjectRooms = createAsyncThunk('currentProject/fetchProjectRooms', async (projectId) => {
    const response = await api.get(`/projects/${projectId}/rooms`);
    return response.data;
});

// ... другие асинхронные действия

const currentProjectSlice = createSlice({
    name: 'currentProject',
    initialState: {
        status: {
            fetchProject: 'idle',
            fetchRooms: 'idle'
        },
        error: {
            fetchProject: null,
            fetchRooms: null
        },
        project: {},
        // ... другие поля состояния
    },
    reducers: {
        updateCurrentProjectRoomTickets: (state, action) => {
            // ... логика обновления тикетов комнат
        },
        updateCurrentProjectApartmentTickets: (state, action) => {
            // ... логика обновления тикетов квартир
        },
        // ... другие редьюсеры
    },
    extraReducers: (builder) => {
        // ... обработка асинхронных действий
    }
});

export const {
    updateCurrentProjectRoomTickets,
    updateCurrentProjectApartmentTickets,
    // ... другие действия
} = currentProjectSlice.actions;

export default currentProjectSlice.reducer;
```

### themeSlice.js

Слайс для управления темой приложения (светлая/темная):

```jsx
import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        mode: 'light'
    },
    reducers: {
        setTheme: (state, action) => {
            state.mode = action.payload;
            localStorage.setItem('theme', action.payload);
        }
    }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
```

## Асинхронные операции

Приложение использует `createAsyncThunk` из Redux Toolkit для обработки асинхронных операций, таких как запросы к API:

```jsx
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
    const response = await api.get('/projects');
    return response.data;
});
```

Каждая асинхронная операция имеет три состояния:
- `pending` - операция выполняется
- `fulfilled` - операция успешно завершена
- `rejected` - операция завершилась с ошибкой

Эти состояния обрабатываются в `extraReducers` слайса:

```jsx
extraReducers: (builder) => {
    builder
        .addCase(fetchProjects.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchProjects.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload;
        })
        .addCase(fetchProjects.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
}
```

## Использование Redux в компонентах

### Доступ к состоянию

Для доступа к состоянию Redux в компонентах используется хук `useSelector`:

```jsx
import { useSelector } from 'react-redux';

const MyComponent = () => {
    const projects = useSelector((state) => state.projects.items);
    const status = useSelector((state) => state.projects.status);
    
    // ... использование данных из состояния
};
```

### Диспетчеризация действий

Для диспетчеризации действий используется хук `useDispatch`:

```jsx
import { useDispatch } from 'react-redux';
import { fetchProjects } from '@slices/projectsSlice';

const MyComponent = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);
    
    // ... остальной код компонента
};
```

## Локальное состояние компонентов

Помимо глобального состояния Redux, компоненты могут иметь локальное состояние, управляемое с помощью хука `useState`:

```jsx
import { useState } from 'react';

const MyComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    
    // ... остальной код компонента
};
```

## Контексты React

Для некоторых аспектов состояния, которые не требуют глобального доступа из всех компонентов, но должны быть доступны в определенной части дерева компонентов, используются контексты React:

```jsx
import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    
    const addNotification = (notification) => {
        setNotifications([...notifications, notification]);
    };
    
    const removeNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };
    
    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    return useContext(NotificationContext);
};
```

## Взаимодействие с localStorage

Приложение использует localStorage для сохранения некоторых данных между сессиями, таких как токен аутентификации, информация о пользователе и предпочтения темы:

```jsx
// Сохранение данных
setLocalStorage('token', response.data.token);
setLocalStorage('user', JSON.stringify(response.data.user));

// Получение данных
const token = getLocalStorage('token');
const user = getCurrentUser();

// Очистка данных
clearLocalStorage();
```

Функции для работы с localStorage определены в файле `src/services/storage.js`.
