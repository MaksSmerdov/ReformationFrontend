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
