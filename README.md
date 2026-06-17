## Ejecucion local

Este backend queda configurado para ejecutarse localmente con Docker Compose. No usa Railway ni `DATABASE_URL`.

El gateway local queda en:

```txt
http://localhost:8080/api
```

Servicios locales:

```txt
ms-auth      http://localhost:3001
ms-lands     http://localhost:3002
ms-valuation http://localhost:8000
gateway      http://localhost:8080
```

Para construir y levantar todo:

```bash
docker-compose up --build
```

Para detener y limpiar contenedores:

```bash
docker-compose down
```

El frontend debe usar:

```txt
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```
