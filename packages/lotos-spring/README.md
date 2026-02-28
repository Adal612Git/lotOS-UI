# @lotosui/spring

Server-side Spring Boot + Thymeleaf adapter for LotOS UI contracts.

This package provides:

- Thymeleaf fragments for shared LotOS UI primitives
- A Java-side contract registry
- A lightweight prop validator for runtime checks
- A runnable example template for internal dashboards

Implemented primitives:

- `button`
- `badge`
- `card`
- `input`
- `form`
- `modal`
- `table`

## Usage

1. Copy the `templates/lotos-ui/components.html` fragment file into your Spring Boot app.
2. Register the validator/config beans from `com.lotosui.spring.config`.
3. Render fragments from Thymeleaf templates:

```html
<div th:replace="~{lotos-ui/components :: lotosCard(title='Ops Queue', body=${cardBody})}"></div>
```

## Example

See:

- `src/main/resources/templates/examples/dashboard.html`
- `src/main/java/com/lotosui/spring/example/LotosDashboardController.java`
