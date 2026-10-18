## Архітектура проєкту (Feature-Sliced Design)

Проєкт побудовано за методологією **Feature-Sliced Design (FSD)**. Стрілками показано напрямок залежностей (нижні шари не можуть імпортувати верхні).

```mermaid
graph TD
    App[App Layer<br>Ініціалізація, провайдери, глобальні стилі] --> Pages

    Pages[Pages Layer<br>Збірка сторінок з віджетів та фіч] --> Widgets
    Pages --> Features
    Pages --> Entities
    Pages --> Shared

    Widgets[Widgets Layer<br>Самостійні блоки, напр. AppHeader, UsersTable] --> Features
    Widgets --> Entities
    Widgets --> Shared

    Features[Features Layer<br>Бізнес-логіка та дії, напр. UserForm] --> Entities
    Features --> Shared

    Entities[Entities Layer<br>Бізнес-сутності: user, session] --> Shared

    Shared[Shared Layer<br>UI-кіти, HTTP-клієнт, утиліти]

    classDef layer fill:#f9f9f9,stroke:#333,stroke-width:2px;
    class App,Pages,Widgets,Features,Entities,Shared layer;
```
