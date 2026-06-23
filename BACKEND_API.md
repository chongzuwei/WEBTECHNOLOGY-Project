# Backend API Endpoints

Base URL:

```text
http://localhost:3000/api
```

All protected endpoints need this header:

```text
Authorization: Bearer <token>
```

## Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check API status |
| `POST` | `/auth/register` | Register student account |
| `POST` | `/auth/login` | Login and receive token |
| `POST` | `/auth/logout` | Logout current token |
| `GET` | `/me` | Get current logged-in user |

## Users

Admin can manage all users. Students can only view/update their own account.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/users` | Get all users |
| `POST` | `/users` | Create user |
| `GET` | `/users/:id` | Get one user |
| `PUT/PATCH` | `/users/:id` | Update one user |
| `DELETE` | `/users/:id` | Delete one user |

## Templates

Anyone can read templates. Admin is required for create/update/delete.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/templates` | Get all templates |
| `POST` | `/templates` | Create template |
| `GET` | `/templates/:id` | Get one template |
| `PUT/PATCH` | `/templates/:id` | Update one template |
| `DELETE` | `/templates/:id` | Delete one template |

## Resumes

Admin can access all resumes. Students can only access their own resumes.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/resumes` | Get all accessible resumes |
| `GET` | `/users/:userId/resumes` | Get resumes for one user |
| `POST` | `/users/:userId/resumes` | Create resume for one user |
| `GET` | `/resumes/:id` | Get one resume |
| `PUT/PATCH` | `/resumes/:id` | Update one resume |
| `DELETE` | `/resumes/:id` | Delete one resume |

## Example Login

```powershell
$login = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@maxcv.com","password":"password"}'

$token = $login.token
```

## Example Create Resume

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/users/124/resumes" `
  -Method POST `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{"title":"Software Engineer Resume","summary":"Vue frontend developer.","selected_template_id":1}'
```
