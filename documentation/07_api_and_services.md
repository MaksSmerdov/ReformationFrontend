# API и сервисы

## Обзор API и сервисов

Приложение взаимодействует с бэкенд-сервером через REST API, используя библиотеку Axios для выполнения HTTP-запросов. Взаимодействие с API инкапсулировано в сервисах, которые предоставляют удобный интерфейс для компонентов приложения.

## Настройка API-клиента

Основная настройка API-клиента находится в файле `src/services/api.js`:

```jsx
import axios from 'axios';
import { clearLocalStorage } from '@services/storage';

const api = axios.create({
    baseURL: '/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.Accept = 'application/json';
        config.headers['X-Requested-With'] = 'XMLHttpRequest';

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (window.location.pathname !== '/login') {
                clearLocalStorage();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
```

Этот код создает экземпляр Axios с базовым URL `/api` и настраивает перехватчики запросов и ответов:

1. **Перехватчик запросов** добавляет заголовки авторизации и другие необходимые заголовки к каждому запросу, если пользователь авторизован (имеется токен).
2. **Перехватчик ответов** обрабатывает ошибки, в частности, перенаправляет на страницу входа при получении ошибки 401 (Unauthorized).

## Основные API-запросы

### Аутентификация

```jsx
// Вход в систему
const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
};

// Выход из системы
const logout = async () => {
    await api.post('/logout');
};
```

### Проекты

```jsx
// Получение списка проектов
const fetchProjects = async () => {
    const response = await api.get('/projects');
    return response.data;
};

// Получение конкретного проекта
const fetchProject = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

// Создание проекта
const createProject = async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
};

// Обновление проекта
const updateProject = async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
};

// Удаление проекта
const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
};
```

### Пользователи

```jsx
// Получение списка пользователей
const fetchUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

// Получение конкретного пользователя
const fetchUser = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

// Создание пользователя
const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};

// Обновление пользователя
const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

// Удаление пользователя
const deleteUser = async (id) => {
    await api.delete(`/users/${id}`);
};
```

### Роли и права доступа

```jsx
// Получение списка ролей
const fetchRoles = async () => {
    const response = await api.get('/roles');
    return response.data;
};

// Получение списка прав доступа
const fetchPermissions = async () => {
    const response = await api.get('/permissions');
    return response.data;
};
```

### Комнаты и квартиры

```jsx
// Получение комнат проекта
const fetchProjectRooms = async (projectId) => {
    const response = await api.get(`/projects/${projectId}/rooms`);
    return response.data;
};

// Получение квартир проекта
const fetchProjectApartments = async (projectId) => {
    const response = await api.get(`/projects/${projectId}/apartments`);
    return response.data;
};
```

### Тикеты

```jsx
// Получение тикетов комнаты
const fetchRoomTickets = async (roomId) => {
    const response = await api.get(`/rooms/${roomId}/tickets`);
    return response.data;
};

// Создание тикета для комнаты
const createRoomTicket = async (roomId, ticketData) => {
    const response = await api.post(`/rooms/${roomId}/tickets`, ticketData);
    return response.data;
};

// Получение тикетов квартиры
const fetchApartmentTickets = async (apartmentId) => {
    const response = await api.get(`/apartments/${apartmentId}/tickets`);
    return response.data;
};

// Создание тикета для квартиры
const createApartmentTicket = async (apartmentId, ticketData) => {
    const response = await api.post(`/apartments/${apartmentId}/tickets`, ticketData);
    return response.data;
};
```

## Сервисы приложения

### Сервис хранилища (storage.js)

Сервис для работы с локальным хранилищем браузера:

```jsx
export const getLocalStorage = (key) => {
    return localStorage.getItem(key);
};

export const getCurrentUser = (key, value) => {
    return JSON.parse(localStorage.getItem('user'));
};

export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
};

export const clearLocalStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
```

### Сервис управления правами доступа (ability.js)

Сервис для управления правами доступа на основе библиотеки CASL:

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { getLocalStorage } from '@services/storage';

export const AbilityContext = createContext();

const defineAdminAbilities = (can, cannot) => {
    can('manage', 'all');
};

const defineUserAbilities = (can, cannot) => {
    can('read', 'DashboardPage');
    cannot('manage', 'all');
};

export const defineAbilitiesFor = (user) => {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.roles && user.roles.some((role) => role.name === 'admin')) {
        defineAdminAbilities(can, cannot);
    } else {
        defineUserAbilities(can, cannot);
    }

    return build();
};

export const useAbility = () => {
    const [ability, setAbility] = useState(defineAbilitiesFor({ roles: [], all_permissions: [] }));

    const updateAbility = (user) => {
        setAbility(defineAbilitiesFor(user));
    };

    useEffect(() => {
        const user = JSON.parse(getLocalStorage('user'));
        if (user) {
            updateAbility(user);
        }
    }, []);

    return { ability, updateAbility };
};
```

## Обработка ошибок

Приложение использует механизм перехвата ошибок Axios для обработки ошибок API:

```jsx
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (window.location.pathname !== '/login') {
                clearLocalStorage();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
```

Кроме того, в слайсах Redux используется обработка ошибок для асинхронных операций:

```jsx
.addCase(login.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.payload;
});
```

## Загрузка файлов

Для загрузки файлов используется FormData:

```jsx
const uploadFile = async (file, ticketId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ticket_id', ticketId);
    
    const response = await api.post('/ticket-files', formData);
    return response.data;
};
```

## Интеграция с Redux

API-запросы интегрированы с Redux через асинхронные действия (thunks):

```jsx
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
```

## Прокси-настройка для разработки

В файле `vite.config.js` настроен прокси для перенаправления API-запросов на бэкенд-сервер во время разработки:

```jsx
server: {
    host: '0.0.0.0',
    port: 7358,
    proxy: {
        '/api': {
            target: process.env.VITE_API_URL,
            changeOrigin: true,
            secure: false
        },
        '/storage': {
            target: process.env.VITE_API_URL,
            changeOrigin: true,
            secure: false
        }
    }
}
```

Это позволяет избежать проблем с CORS при разработке, так как запросы к `/api` будут перенаправляться на бэкенд-сервер, указанный в переменной окружения `VITE_API_URL`.
