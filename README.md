# Документация по React-приложению ReformationFrontend
## Кратко о главном
### Интеграция с бэкендом

Система ролей и прав доступа интегрирована с бэкендом, который предоставляет API для управления пользователями, ролями и правами доступа. При аутентификации бэкенд возвращает информацию о пользователе, включая его роли и права доступа, которые затем используются для настройки объекта `ability` на клиентской стороне.

### Безопасность

Важно отметить, что проверка прав доступа на клиентской стороне не является достаточной мерой безопасности. Все критические операции должны также проверяться на серверной стороне. Клиентская проверка прав доступа служит в основном для улучшения пользовательского интерфейса, скрывая недоступные функции и предотвращая отправку запросов, которые будут отклонены сервером.




### Фронтенд технологии:

- **Vite** - Инструмент для сборки и разработки фронтенд-приложений.
- **React** - Библиотека для создания пользовательских интерфейсов.
- **React-Bootstrap** - Набор готовых компонентов для React, основанных на Bootstrap.
- **Bootstrap** - CSS-фреймворк для разработки адаптивных и мобильных веб-сайтов.
- **Redux** - Библиотека для управления состоянием приложения.
- **axios** - Библиотека для выполнения HTTP-запросов.
- **react-router-dom** - Библиотека для маршрутизации в приложениях на React.
- **@casl/ability** - Библиотека для управления правами доступа и авторизацией.
- **i18next** - Библиотека для интернационализации и локализации приложений.
- **Konva** - Инструмент для визуализации для проектного типа "фасады"

### Фронтенд:

#### Первоначальная подгрузка пакетов (обязательна после клонирования репозитория):

```sh
npm install
```

& требуется настройка .env файла/ов

#### Локальный запуск для разработки с мгновенной отладкой:

```sh
npm run dev
```

#### Запуск упаковки приложения:

```sh
npm run package
```

#### Сканирование всех компонентов на наличие новых "ключей" переводо:

```sh
npm run i18-extract-languages
```

### Бэкенд:

#### Запуск бэкенда:

```sh
composer install
php artisan key:generate
```

& требуется настройка .env файла

#### Миграция обычная (необходима при первом запуске):

```sh
php artisan migrate --seed
```

#### Миграция принудительная (при изменении структуры таблиц):

```sh
php artisan migrate:fresh --seed
```

#### Очистка (иногда пригождается):

```sh
php artisan cache:clear
```

```sh
php artisan view:clear
```

#### Очистка кэша конфига:

```sh
php artisan config:clear
```

#### Очистка кэша роутов:

```sh
php artisan route:clear
```

#### Просмотр роутов:

```sh
php artisan route:list
```

#### Создание символической ссылки (для доступа к файлам):

```sh
php artisan storage:link
```

## Введение

Данное приложение представляет собой фронтенд-часть системы управления проектами реформации/реконструкции зданий. Приложение разработано с использованием современных технологий и библиотек, обеспечивающих эффективную работу с проектами, квартирами, комнатами, статусами и тикетами.


# Оглавление документации
1. [Введение](documentation/01_introduction.md)
2. [Установка и запуск](documentation/02_installation_and_launch.md)
3. [Структура проекта](documentation/03_project_structure.md)
4. [Компоненты приложения](documentation/04_application_components.md)
5. [Маршрутизация](documentation/05_routing.md)
6. [Управление состоянием](documentation/06_state_management.md)
7. [API и сервисы](documentation/07_api_and_services.md)
8. [Пользовательские роли и права доступа](documentation/08_user_roles_and_permissions.md)

### Основные технологии

- **Vite** - Инструмент для сборки и разработки фронтенд-приложений, обеспечивающий быструю компиляцию и горячую замену модулей.
- **React** - Библиотека для создания пользовательских интерфейсов с компонентным подходом.
- **React-Bootstrap** - Набор готовых компонентов для React, основанных на Bootstrap, обеспечивающих единый стиль интерфейса.
- **Bootstrap** - CSS-фреймворк для разработки адаптивных и мобильных веб-сайтов.
- **Redux** - Библиотека для управления состоянием приложения, обеспечивающая предсказуемое поведение и централизованное хранение данных.
- **axios** - Библиотека для выполнения HTTP-запросов к серверу.
- **react-router-dom** - Библиотека для маршрутизации в приложениях на React.
- **@casl/ability** - Библиотека для управления правами доступа и авторизацией.
- **i18next** - Библиотека для интернационализации и локализации приложений.
- **Konva** - Инструмент для визуализации для проектного типа "фасады"

### Общая структура приложения

Приложение представляет собой многостраничный интерфейс с системой аутентификации и авторизации, позволяющий пользователям с различными ролями (администратор, супервайзер, обычный пользователь) работать с проектами реформации зданий. Основные функциональные возможности включают:

1. **Управление проектами** - создание, редактирование и просмотр проектов различных типов (фасады, комнаты).
2. **Управление пользователями** - администрирование пользователей, ролей и прав доступа.
3. **Управление объектами** - работа с лестничными клетками, квартирами, комнатами и их статусами.
4. **Система тикетов** - создание и отслеживание тикетов для квартир и комнат.
5. **Интернационализация** - поддержка многоязычности интерфейса.

Приложение использует современную архитектуру с разделением на компоненты, контексты, сервисы и слайсы Redux для управления состоянием, что обеспечивает масштабируемость и поддерживаемость кода.


# Установка и запуск

## Требования

Для работы с приложением необходимо наличие следующего программного обеспечения:

- Node.js (рекомендуется версия 20.x или выше)
- npm (менеджер пакетов Node.js)
- Современный веб-браузер с поддержкой JavaScript

## Первоначальная настройка

### Клонирование репозитория

Первым шагом необходимо клонировать репозиторий с исходным кодом приложения:

```sh
git clone <URL_репозитория>
cd ReformationFrontend-main
```

### Установка зависимостей

После клонирования репозитория необходимо установить все зависимости проекта:

```sh
npm install
```

Этот процесс может занять некоторое время, так как будут загружены и установлены все необходимые библиотеки и пакеты.

### Настройка переменных окружения

Приложение использует переменные окружения для конфигурации. Необходимо создать файл `.env` в корневой директории проекта на основе предоставленного примера:

```sh
cp .env.example .env
```

Затем отредактируйте файл `.env`, указав необходимые параметры:

- `VITE_API_URL` - URL API-сервера (бэкенда)
- Другие необходимые параметры конфигурации

## Запуск приложения

### Режим разработки

Для запуска приложения в режиме разработки с горячей перезагрузкой выполните команду:

```sh
npm run dev
```

После запуска приложение будет доступно по адресу `http://localhost:7358` (порт может быть изменен в конфигурации).

### Сборка для продакшена

Для создания оптимизированной версии приложения для продакшена выполните команду:

```sh
npm run build
```

Результат сборки будет помещен в директорию `dist`.

### Предварительный просмотр собранного приложения

Для предварительного просмотра собранного приложения выполните команду:

```sh
npm run preview
```

## Интернационализация

Приложение поддерживает многоязычность. Для работы с переводами используются следующие команды:

### Извлечение ключей для перевода

```sh
npm run i18-extract-languages
```

Эта команда сканирует все компоненты на наличие новых ключей для перевода и обновляет файлы переводов.

### Миграция переводов

```sh
npm run i18-migrate
```

Эта команда выполняет миграцию существующих переводов при изменении структуры ключей.

## Взаимодействие с бэкендом

Приложение взаимодействует с бэкенд-сервером через API. Для корректной работы необходимо, чтобы бэкенд-сервер был запущен и доступен по URL, указанному в переменной окружения `VITE_API_URL`.

Инструкции по настройке и запуску бэкенда:

```sh
composer install
php artisan key:generate
```

Требуется настройка файла `.env` для бэкенда.

### Миграция базы данных

При первом запуске:

```sh
php artisan migrate --seed
```

При изменении структуры таблиц:

```sh
php artisan migrate:fresh --seed
```

### Очистка кэша

```sh
php artisan cache:clear
php artisan view:clear
php artisan config:clear
php artisan route:clear
```

### Создание символической ссылки для доступа к файлам

```sh
php artisan storage:link
```


# Структура проекта

## Обзор файловой структуры

Проект имеет следующую структуру директорий и файлов:

```
ReformationFrontend-main/
├── .env.example              # Пример файла переменных окружения
├── .env.production           # Файл переменных окружения для продакшена
├── .gitignore                # Список игнорируемых Git файлов
├── README.md                 # Документация проекта
├── eslint.config.js          # Конфигурация ESLint
├── index.html                # Основной HTML-файл
├── info/                     # Директория с информационными файлами
├── package.json              # Файл зависимостей и скриптов npm
├── public/                   # Публичные статические файлы
├── src/                      # Исходный код приложения
│   ├── App.jsx               # Основной компонент приложения
│   ├── assets/               # Статические ресурсы (стили, изображения)
│   ├── components/           # Компоненты React
│   ├── contexts/             # Контексты React
│   ├── dev_scripts/          # Скрипты для разработки
│   ├── hooks/                # Пользовательские хуки React
│   ├── pages/                # Компоненты страниц
│   ├── root.jsx              # Точка входа приложения
│   ├── routes/               # Компоненты маршрутизации
│   ├── services/             # Сервисы (API, хранилище, авторизация)
│   ├── slices/               # Слайсы Redux
│   └── utils/                # Утилиты и вспомогательные функции
└── vite.config.js            # Конфигурация Vite
```

## Ключевые файлы и директории

### Корневые файлы

- **index.html**: Основной HTML-файл, точка входа для браузера.
- **vite.config.js**: Конфигурация сборщика Vite, включая настройки прокси для API, алиасы путей и параметры сборки.
- **package.json**: Описание проекта, зависимости и скрипты npm.
- **.env.example**: Пример файла с переменными окружения.
- **.env.production**: Файл с переменными окружения для продакшена.

### Директория src

#### Основные файлы

- **root.jsx**: Точка входа React-приложения, инициализирует Redux, i18next и тему.
- **App.jsx**: Основной компонент приложения, содержит настройку маршрутизации и провайдеры контекстов.

#### Поддиректории

- **assets/**: Содержит статические ресурсы:
  - **styles/**: SCSS и CSS файлы
  - **images/**: Изображения
  - **fonts/**: Шрифты

- **components/**: Компоненты React, организованные по функциональности:
  - **admin/**: Компоненты для административной панели
  - **common/**: Общие компоненты, используемые во всем приложении
  - **dashboard/**: Компоненты для дашборда
  - **project/**: Компоненты для работы с проектами
  - **supervisor/**: Компоненты для панели супервайзера

- **contexts/**: Контексты React для управления состоянием:
  - **application/**: Контексты уровня приложения (уведомления, подтверждения)
  - **rooms_project/**: Контексты для проектов с комнатами
  - **cell_system/**: Контексты для системы ячеек

- **hooks/**: Пользовательские хуки React:
  - **useProjectTypeNames.js**: Хук для получения имен типов проектов
  - **useProjectTypes.js**: Хук для работы с типами проектов

- **pages/**: Компоненты страниц приложения:
  - **AccountPage.jsx**: Страница профиля пользователя
  - **AdminPage.jsx**: Административная панель
  - **CommunicationPage.jsx**: Страница коммуникаций
  - **DashboardPage.jsx**: Главная страница с проектами
  - **FacadeViewPage.jsx**: Страница просмотра фасадов
  - **LoginPage.jsx**: Страница входа
  - **NotFoundPage.jsx**: Страница 404
  - **ProjectPage.jsx**: Страница проекта
  - **SupervisorPage.jsx**: Панель супервайзера
  - **TestPage.jsx**: Тестовая страница

- **routes/**: Компоненты маршрутизации:
  - **AdminRoute.jsx**: Защищенный маршрут для администраторов
  - **PrivateRoute.jsx**: Защищенный маршрут для авторизованных пользователей

- **services/**: Сервисы приложения:
  - **ability.js**: Сервис управления правами доступа (CASL)
  - **api.js**: Настройка Axios для работы с API
  - **storage.js**: Функции для работы с localStorage
  - **store.js**: Конфигурация Redux-хранилища

- **slices/**: Слайсы Redux для управления состоянием:
  - **authSlice.js**: Аутентификация и авторизация
  - **currentProjectSlice.js**: Текущий проект
  - **projectsSlice.js**: Список проектов
  - **usersSlice.js**: Пользователи
  - **rolesSlice.js**: Роли
  - **permissionsSlice.js**: Права доступа
  - **themeSlice.js**: Тема приложения
  - И другие слайсы для различных сущностей

- **utils/**: Утилиты и вспомогательные функции:
  - **i18n.js**: Настройка интернационализации

## Алиасы путей

В проекте настроены алиасы путей для упрощения импортов:

- **@**: Корневая директория src
- **@pages**: Директория src/pages
- **@components**: Директория src/components
- **@services**: Директория src/services
- **@utils**: Директория src/utils
- **@slices**: Директория src/slices
- **@routes**: Директория src/routes
- **@assets**: Директория src/assets
- **@hooks**: Директория src/hooks
- **@contexts**: Директория src/contexts

Эти алиасы настроены в файле vite.config.js и позволяют использовать абсолютные пути вместо относительных, что упрощает импорты и повышает читаемость кода.


# Компоненты приложения

## Обзор компонентной структуры

Приложение построено на основе компонентного подхода React, что обеспечивает модульность, переиспользуемость и поддерживаемость кода. Компоненты организованы в иерархическую структуру и разделены по функциональному назначению.

## Основные компоненты

### Корневые компоненты

#### App.jsx

Основной компонент приложения, который определяет структуру маршрутизации и включает в себя провайдеры контекстов:

```jsx
function App() {
    const token = useSelector((state) => state.auth.token);
    const { ability, updateAbility } = useAbility();

    return (
        <AbilityContext.Provider value={{ ability, updateAbility }}>
            <NotificationProvider>
                <ConfirmationProvider>
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
                </ConfirmationProvider>
            </NotificationProvider>
        </AbilityContext.Provider>
    );
}
```

#### MainContainer

Компонент-контейнер, который определяет общую структуру для авторизованных страниц, включая навигационное меню, заголовок и основное содержимое.

### Компоненты страниц

#### LoginPage

Страница авторизации пользователя, содержит форму входа с полями для ввода логина и пароля.

#### DashboardPage

Главная страница приложения, отображает список доступных проектов и предоставляет функциональность для работы с ними:

```jsx
const DashboardPage = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'pages.dashboard_page' });

    return (
        <div className="w-100 d-flex flex-column align-items-center text-nowrap">
            <h1 className="py-4">{t('title')}</h1>
            <ProjectsTable />
        </div>
    );
};
```

#### ProjectPage

Страница проекта, отображает детальную информацию о выбранном проекте и предоставляет интерфейс для работы с ним. В зависимости от типа проекта (фасады или комнаты) отображает соответствующие компоненты:

```jsx
const renderProjectContent = () => {
    switch (project.type.id) {
        case 1:
            return <FacadesProjectComponent projectId={id} project={project} />;
        case 2:
            return <RoomsProjectComponent projectId={id} />;
        default:
            return <div>{/* Unknown project type */}</div>;
    }
};
```

#### AdminPage

Административная панель, предоставляющая интерфейс для управления пользователями, ролями, правами доступа и специализациями:

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

#### SupervisorPage

Панель супервайзера, предоставляющая интерфейс для управления проектами, оборудованием и командами:

```jsx
const SupervisorPage = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'pages.supervisor_page' });

    return (
        <AdminRoute>
            <Tabs defaultActiveKey="tab1" id="supervisor-tabs" className="px-4 justify-content-center">
                <Tab eventKey="tab1" title={t('tab_projects')} className="px-4">
                    <ProjectsTable />
                </Tab>
                <Tab eventKey="tab2" title={t('tab_equipments')} className="px-4">
                    <EquipmentTable />
                </Tab>
                <Tab eventKey="tab3" title={t('tab_teams')} className="px-4">
                    <TeamsTable />
                </Tab>
            </Tabs>
        </AdminRoute>
    );
};
```

### Функциональные компоненты

#### ProjectsTable

Компонент для отображения списка проектов в виде таблицы с возможностью сортировки, фильтрации и поиска.

#### RoomsProjectComponent

Компонент для работы с проектами типа "комнаты", отображает структуру здания, квартиры и комнаты, а также предоставляет интерфейс для управления их статусами и тикетами.

#### FacadesProjectComponent

Компонент для работы с проектами типа "фасады", отображает структуру фасадов здания и предоставляет интерфейс для управления их элементами.

### Компоненты форм

#### UserForm

Форма для создания и редактирования пользователей, включает поля для ввода имени, email, пароля и выбора ролей.

#### ProjectForm

Форма для создания и редактирования проектов, включает поля для ввода названия, описания, выбора типа проекта и других параметров.

### Общие компоненты

#### IconButton

Кнопка с иконкой, используется для различных действий в интерфейсе:

```jsx
const IconButton = ({ icon: Icon, variant, onClick, className, ...props }) => {
    return (
        <Button variant={variant} onClick={onClick} className={`d-flex align-items-center justify-content-center ${className}`} {...props}>
            <Icon />
        </Button>
    );
};
```

#### ConfirmationModal

Модальное окно для подтверждения действий пользователя, используется для предотвращения случайных действий.

#### NotificationToast

Компонент для отображения уведомлений пользователю о результатах выполнения операций.

## Контексты

### AbilityContext

Контекст для управления правами доступа пользователей на основе библиотеки CASL:

```jsx
export const AbilityContext = createContext();

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

### NotificationContext

Контекст для управления системой уведомлений в приложении.

### ConfirmationContext

Контекст для управления диалогами подтверждения действий.

## Хуки

### useProjectTypes

Хук для получения и работы с типами проектов:

```jsx
export const useProjectTypes = () => {
    const dispatch = useDispatch();
    const projectTypes = useSelector((state) => state.projectTypes.items);
    const status = useSelector((state) => state.projectTypes.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProjectTypes());
        }
    }, [status, dispatch]);

    return { projectTypes, status };
};
```

### useProjectTypeNames

Хук для получения имен типов проектов с учетом текущего языка интерфейса.

## Стилизация компонентов

Приложение использует комбинацию Bootstrap, React-Bootstrap и собственных стилей SCSS для оформления интерфейса. Основные классы стилей соответствуют соглашениям Bootstrap, а также используются дополнительные классы для специфических элементов интерфейса.

## Интернационализация компонентов

Все текстовые строки в компонентах обернуты в функцию перевода `t()` из библиотеки i18next, что обеспечивает поддержку многоязычности:

```jsx
const { t } = useTranslation('translation', { keyPrefix: 'pages.dashboard_page' });
<h1 className="py-4">{t('title')}</h1>
```

Ключи переводов организованы в иерархическую структуру, соответствующую структуре компонентов приложения.


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
- `/showcase` - демонстрационная страница

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
