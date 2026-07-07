# Mini ERP - Frontend

Inventory & Sales Management System frontend built for the MERN Stack Technical Assessment.

## Tech Stack

- React
- TypeScript
- React Router
- Redux Toolkit + RTK Query
- Tailwind CSS
- Shadcn/ui

## Features

- Login with JWT-based authentication
- Protected routes with role-based access control (Admin, Manager, Employee)
- Dashboard with statistics cards and low stock product list
- Product management: list, add, edit, delete, image upload, search, pagination
- Sale creation with searchable product selection, quantity input, and automatic total calculation

## Getting Started

### Prerequisites

- Node.js (v18+)
- Backend API running (see [backend repo](https://github.com/bayazidhassan/Mini_ERP_Backend))

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/bayazidhassan/Mini_ERP.git
   cd Mini_ERP
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:5000/api/v1
   ```
   For connecting to the live backend instead:
   ```
   VITE_API_URL=https://mini-erp-backend-c922.onrender.com/api/v1
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

## Live Site

https://mini-erp-bd.vercel.app

## Login Credentials (for testing)

- Email: `bayazidhassan776@gmail.com`
- Password: `12345678`
