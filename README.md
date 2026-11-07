# Ecommerce Admin Dashboard

React 18 admin dashboard for a small ecommerce project: sales stats and
charts, product upload/edit/delete, and order management.

Part of a three-repo project:

- **Backend API**: [Ecom-Backend-Completed](https://github.com/HamidAlvi768/Ecom-Backend-Completed) (required)
- **Customer store**: [Ecommerce-Store](https://github.com/HamidAlvi768/Ecommerce-Store)

## Run it

Start the backend first, then:

```
cd dashboard
npm install
set PORT=3001&& npm start      # Windows; on macOS/Linux: PORT=3001 npm start
```

The app calls `http://localhost:5000/api` by default. To use another backend,
create `dashboard/.env` with `REACT_APP_API_URL=https://your-api/api`.

## Logging in

Only **admin** accounts can log in. There is no signup here: create an account
in the store, then in the backend folder run
`npm run make-admin -- that@email.com`. The backend's `npm run seed` also
creates a demo admin for local testing.
