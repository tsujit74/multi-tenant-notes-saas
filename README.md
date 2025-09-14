

# Multi-Tenant Notes SaaS

**Frontend URL:** [https://notes-saas-frontend-tau.vercel.app/](https://notes-saas-frontend-tau.vercel.app/)
**Backend API Base URL:** [https://notes-saas-backend-chi.vercel.app](https://notes-saas-backend-chi.vercel.app)

---

## 📝 Project Description

This is a SaaS Notes Application with support for multiple tenants (companies), built to meet the following requirements:

* Support at least two tenants (Acme, Globex).
* Strict data isolation: tenants’ data cannot leak into each other.
* JWT-based authentication.
* Two user roles: **Admin** (can invite/upgrade) and **Member** (only notes CRUD).
* Free plan limits (max **3 notes**) for Free tenants; Pro plan is unlimited.
* Admin endpoints to upgrade/downgrade subscription.
* Notes CRUD API (create, read all, read one, update, delete).
* Health endpoint (`/health`).
* Minimal frontend: login, notes UI, “upgrade/downgrade” actions, role-based navigation.
* Full deployment to Vercel (frontend + backend).

---

## ✅ Features implemented

| Feature                                                                                                         | Status |
| --------------------------------------------------------------------------------------------------------------- | ------ |
| Multi-tenant support (shared schema with tenant ID)                                                             | ✅      |
| Test accounts seeded ([admin@acme.test](mailto:admin@acme.test), [user@acme.test](mailto:user@acme.test), etc.) | ✅      |
| JWT login/logout                                                                                                | ✅      |
| Notes CRUD work (create, read, update, delete)                                                                  | ✅      |
| Free plan limit (3 notes) enforced for Members                                                                  | ✅      |
| Role-based access control (Admin vs Member)                                                                     | ✅      |
| Admin Dashboard: view tenant + users, upgrade/downgrade plan                                                    | ✅      |
| Logout, navigation, protected routes                                                                            | ✅      |
| Health endpoint                                                                                                 | ✅      |
| Deployed frontend & backend on Vercel with production Postgres                                                  | ✅      |

---

## 🔧 Usage / Setup (Local Development)

1. Clone the repo:

   ```bash
   git clone https://github.com/tsujit74/multi-tenant-notes-saas.git
   ```

2. Install dependencies for backend & frontend:

   ```bash
   cd notes-saas-backend
   npm install

   cd ../notes-saas-frontend
   npm install
   ```

3. Setup `DATABASE_URL` in backend `.env` to use your local Postgres (or cloud). For example:

   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/notes_saas?schema=public
   JWT_SECRET=your_jwt_secret
   ```

4. Run Prisma migrations & seed:

   ```bash
   cd notes-saas-backend
   npx prisma migrate dev --name init
   npx prisma migrate deploy  # for later
   npm run seed   # if you have a seed script
   ```

5. Start backend & frontend:

   ```bash
   # backend
   npm run dev  # or ts-node-dev src/index.ts

   # frontend
   cd ../notes-saas-frontend
   npm run dev
   ```

6. Login with test accounts:

   * `admin@acme.test` / `password`  (Admin, tenant = Acme)
   * `user@acme.test` / `password`   (Member, tenant = Acme)
   * `admin@globex.test` / `password` (Admin, tenant = Globex)
   * `user@globex.test` / `password`  (Member, tenant = Globex)

---

## 🌐 Production / Deployed

* Frontend: [https://notes-saas-frontend-tau.vercel.app/](https://notes-saas-frontend-tau.vercel.app/)
* Backend: [https://notes-saas-backend-chi.vercel.app](https://notes-saas-backend-chi.vercel.app)

Ensure that the frontend’s environment variable **NEXT\_PUBLIC\_API\_URL** is set to the backend URL (`https://notes-saas-backend-chi.vercel.app`).

---

## 📚 API Endpoints

Here are the main endpoints, with authentication & authorization details:

| Endpoint                        | Method | Purpose                               | Access                                         |
| ------------------------------- | ------ | ------------------------------------- | ---------------------------------------------- |
| `POST /auth/login`              | POST   | Log in, receive JWT token + user info | Public                                         |
| `GET /health`                   | GET    | Health check                          | Public                                         |
| `GET /notes`                    | GET    | List all notes for tenant             | Member & Admin                                 |
| `POST /notes`                   | POST   | Create a new note                     | Member & Admin (free limit applies to Members) |
| `GET /notes/:id`                | GET    | Get specific note                     | Members & Admin, only within same tenant       |
| `PUT /notes/:id`                | PUT    | Edit note                             | Members & Admin                                |
| `DELETE /notes/:id`             | DELETE | Delete note                           | Members & Admin                                |
| `GET /tenants/me`               | GET    | Get tenant info + users               | Admin only                                     |
| `POST /tenants/:slug/upgrade`   | POST   | Upgrade plan to Pro                   | Admin only                                     |
| `POST /tenants/:slug/downgrade` | POST   | Downgrade plan to Free                | Admin only                                     |

---

## 🔐 Role behavior

* **Admin**: can do everything (notes CRUD, upgrade & downgrade plan, view users, admin dashboard).
* **Member**: can only create/view/edit/delete notes, limited to 3 notes if tenant is on Free plan.

---

## ⚙️ Known issues / future improvements

* No invite user UI yet (Tenant Admin inviting new users can be added).
* Password reset / email verification not implemented.
* Styling / UX can be improved.
* Possibly add tests & better error messages.

---

## 📁 Branches & Git Workflow

* `frontend-rbac`: front end features especially RBAC, admin dashboard.
* `tenant-upgrade`: backend features for upgrade/downgrade, tenant data.
* After merging both into `main`, `main` branch is stable & production-ready.


---

## 📄 Summary

This project implements a multi-tenant notes SaaS solution with role-based access, subscription gating, and notes management for multiple tenants. The deployed URLs above let you test it live.

---
