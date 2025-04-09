# Пользовательские роли и права доступа

## Обзор системы ролей и прав доступа

Приложение использует библиотеку CASL для реализации системы ролей и прав доступа. Эта система позволяет гибко настраивать права доступа для различных пользователей в зависимости от их ролей и индивидуальных разрешений.

## Основные роли пользователей

В приложении определены следующие основные роли:

### Администратор (admin)

Администраторы имеют полный доступ ко всем функциям приложения, включая:
- Управление пользователями (создание, редактирование, удаление)
- Управление ролями и правами доступа
- Управление проектами и всеми их компонентами
- Доступ к административной панели
- Настройка системных параметров

### Супервайзер (supervisor)

Супервайзеры имеют расширенные права для управления проектами:
- Создание и редактирование проектов
- Управление командами и оборудованием
- Назначение задач и контроль их выполнения
- Доступ к панели супервайзера
- Просмотр статистики и отчетов

### Пользователь (user)

Обычные пользователи имеют ограниченный доступ к функциям приложения:
- Просмотр доступных проектов
- Работа с назначенными задачами
- Обновление статусов комнат и квартир
- Создание тикетов
- Просмотр своего профиля

## Реализация системы прав доступа

### Определение прав доступа

Права доступа определяются в файле `src/services/ability.js`:

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

### Использование контекста AbilityContext

Контекст `AbilityContext` предоставляет доступ к объекту `ability` во всем приложении:

```jsx
function App() {
    const token = useSelector((state) => state.auth.token);
    const { ability, updateAbility } = useAbility();

    return (
        <AbilityContext.Provider value={{ ability, updateAbility }}>
            {/* Содержимое приложения */}
        </AbilityContext.Provider>
    );
}
```

### Проверка прав доступа в компонентах

В компонентах права доступа проверяются с помощью метода `can`:

```jsx
import { useContext } from 'react';
import { AbilityContext } from '@services/ability';

const MyComponent = () => {
    const { ability } = useContext(AbilityContext);
    
    return (
        <div>
            {ability.can('manage', 'User') && (
                <button>Редактировать пользователя</button>
            )}
        </div>
    );
};
```

### Защищенные маршруты

Для защиты маршрутов используются компоненты `PrivateRoute` и `AdminRoute`:

```jsx
const AdminRoute = ({ children }) => {
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);
    const { ability } = useContext(AbilityContext);
    
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    if (!ability.can('manage', 'all')) {
        return <Navigate to="/dashboard" />;
    }
    
    return children;
};
```

## Управление ролями и правами доступа

### Административная панель

Административная панель (`AdminPage`) предоставляет интерфейс для управления ролями и правами доступа:

```jsx
const AdminPage = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'pages.admin_page' });

    return (
        <AdminRoute>
            <Tabs defaultActiveKey="users" id="admin-tabs" className="px-4 justify-content-center">
                <Tab eventKey="users" title={t('tab_users')} className="px-4 overflow-auto">
                    <UsersTable />
                </Tab>
                <Tab eventKey="roles" title={t('roles')} className="px-4 overflow-auto">
                    <RolesTable />
                </Tab>
                <Tab eventKey="permissions" title={t('permissions')} className="px-4 overflow-auto">
                    <PermissionsTable />
                </Tab>
                <Tab eventKey="specializations" title={t('specializations')} className="px-4 overflow-auto">
                    <SpecializationsTable />
                </Tab>
            </Tabs>
        </AdminRoute>
    );
};
```

### Управление пользователями

Компонент `UsersTable` позволяет администраторам управлять пользователями и их ролями:
- Создание новых пользователей
- Редактирование существующих пользователей
- Назначение ролей пользователям
- Блокировка/разблокировка пользователей
- Удаление пользователей

### Управление ролями

Компонент `RolesTable` позволяет администраторам управлять ролями:
- Создание новых ролей
- Редактирование существующих ролей
- Назначение прав доступа ролям
- Удаление ролей

### Управление правами доступа

Компонент `PermissionsTable` позволяет администраторам управлять правами доступа:
- Просмотр доступных прав доступа
- Создание новых прав доступа
- Редактирование существующих прав доступа
- Удаление прав доступа

## Обновление прав доступа при аутентификации

При успешной аутентификации пользователя его права доступа обновляются:

```jsx
.addCase(login.fulfilled, (state, action) => {
    state.token = action.payload.token;
    state.user = action.payload.user;
    state.status = 'succeeded';
    state.ability = defineAbilitiesFor(action.payload.user);
});
```

## Хранение информации о пользователе и его ролях

Информация о пользователе и его ролях хранится в localStorage для сохранения сессии между перезагрузками страницы:

```jsx
setLocalStorage('token', response.data.token);
setLocalStorage('user', JSON.stringify(response.data.user));
```

При загрузке приложения эта информация восстанавливается:

```jsx
const token = getLocalStorage('token');
const user = getCurrentUser();
```

## Примеры использования прав доступа

### Скрытие элементов интерфейса

```jsx
{ability.can('manage', 'User') && (
    <Button onClick={handleEditUser}>Редактировать пользователя</Button>
)}
```

### Блокировка действий

```jsx
<Button 
    onClick={handleDeleteProject} 
    disabled={!ability.can('delete', 'Project')}
>
    Удалить проект
</Button>
```

### Условная маршрутизация

```jsx
const handleClick = () => {
    if (ability.can('manage', 'AdminPanel')) {
        navigate('/admin-panel');
    } else {
        navigate('/dashboard');
    }
};
```

## Интеграция с бэкендом

Система ролей и прав доступа интегрирована с бэкендом, который предоставляет API для управления пользователями, ролями и правами доступа. При аутентификации бэкенд возвращает информацию о пользователе, включая его роли и права доступа, которые затем используются для настройки объекта `ability` на клиентской стороне.

## Безопасность

Важно отметить, что проверка прав доступа на клиентской стороне не является достаточной мерой безопасности. Все критические операции должны также проверяться на серверной стороне. Клиентская проверка прав доступа служит в основном для улучшения пользовательского интерфейса, скрывая недоступные функции и предотвращая отправку запросов, которые будут отклонены сервером.
