# Маршрутизация

## Обзор системы маршрутизации

Приложение использует библиотеку `react-router-dom` версии 7.x для организации маршрутизации. Маршрутизация определяет структуру навигации по приложению и обеспечивает отображение соответствующих компонентов в зависимости от текущего URL.

## Основная структура маршрутов

Основная структура маршрутов определена в компоненте `App.jsx`:

```jsx
<Router>
    <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/" element={<MainContainer />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="project/:projectId" element={<ProjectPage />} />
            <Route path="project/:projectId/facade/:facadeId" element={<FacadeViewPage />} />
            <Route path="admin-panel" element={<AdminPage />} />
            <Route path="supervisor-panel" element={<SupervisorPage />} />
            <Route path="communication" element={<CommunicationPage />} />
            <Route path="profile" element={<AccountPage />} />
            <Route path="test" element={<TestPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    </Routes>
</Router>
```

## Типы маршрутов

### Публичные маршруты

Маршруты, доступные без аутентификации:

- `/login` - страница входа в систему

### Защищенные маршруты

Маршруты, требующие аутентификации пользователя:

- `/dashboard` - главная страница с проектами
- `/project/:projectId` - страница конкретного проекта
- `/project/:projectId/facade/:facadeId` - страница просмотра фасада
- `/communication` - страница коммуникаций
- `/profile` - страница профиля пользователя

### Административные маршруты

Маршруты, доступные только для пользователей с административными правами:

- `/admin-panel` - административная панель
- `/supervisor-panel` - панель супервайзера

## Компоненты маршрутизации

### PrivateRoute

Компонент для защиты маршрутов, требующих аутентификации. Проверяет наличие токена и перенаправляет на страницу входа, если пользователь не авторизован:

```jsx
const PrivateRoute = ({ children }) => {
    const token = useSelector((state) => state.auth.token);
    
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    return children;
};
```

### AdminRoute

Компонент для защиты маршрутов, требующих административных прав. Проверяет наличие токена и соответствующих прав доступа:

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

## Параметры маршрутов

Некоторые маршруты содержат параметры, которые используются для идентификации ресурсов:

- `:projectId` в маршруте `/project/:projectId` - идентификатор проекта
- `:projectId` и `:facadeId` в маршруте `/project/:projectId/facade/:facadeId` - идентификаторы проекта и фасада

Эти параметры доступны в компонентах через хук `useParams()`:

```jsx
const { projectId } = useParams();
```

## Программная навигация

Для программной навигации используется хук `useNavigate()`:

```jsx
const navigate = useNavigate();

// Переход на другую страницу
navigate('/dashboard');

// Переход назад
navigate(-1);
```

## Обработка несуществующих маршрутов

Для обработки несуществующих маршрутов используется маршрут с путем `*`, который отображает компонент `NotFoundPage`:

```jsx
<Route path="*" element={<NotFoundPage />} />
```

## Вложенные маршруты

Приложение использует вложенные маршруты для организации структуры интерфейса. Маршруты, вложенные в маршрут с компонентом `MainContainer`, наследуют общую структуру интерфейса (навигационное меню, заголовок и т.д.):

```jsx
<Route path="/" element={<MainContainer />}>
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="project/:projectId" element={<ProjectPage />} />
    {/* Другие вложенные маршруты */}
</Route>
```

Компонент `MainContainer` использует компонент `Outlet` для отображения содержимого вложенных маршрутов:

```jsx
const MainContainer = () => {
    return (
        <div className="main-container">
            <Header />
            <Sidebar />
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};
```

## Редиректы

Приложение использует компонент `Navigate` для реализации редиректов:

```jsx
// Редирект на дашборд, если пользователь авторизован
<Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />

// Редирект на страницу входа, если пользователь не авторизован
<Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
```

## Интеграция с Redux

Маршрутизация тесно интегрирована с Redux для проверки состояния аутентификации и прав доступа пользователя:

```jsx
const token = useSelector((state) => state.auth.token);
const user = useSelector((state) => state.auth.user);
```

Это позволяет динамически изменять доступные маршруты в зависимости от состояния пользователя.
