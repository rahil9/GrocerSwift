# 🛒 GrocerSwift – Modern Grocery Web App

GrocerSwift is a sleek, fast, and modern grocery shopping web application built using the latest frontend technologies. Designed with performance and user experience in mind, it allows users to explore grocery items, manage authentication, and interact with beautifully crafted UI components.
> 🌐 **Live Demo**: [grocer-swift.vercel.app](https://grocer-swift.vercel.app/)

## 🚀 Features

- **Modern Tech Stack**
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - Firebase Integration

- **Rich UI Components**
  - @radix-ui/\* - Comprehensive UI component library
  - tailwindcss - Utility-first CSS framework
  - class-variance-authority - Component styling
  - lucide-react - Icon library

- **Authentication**
  - Firebase Authentication integration
  - Protected routes
  - User session management

## 📸 Screenshots

### Main Application
<img src="https://github.com/user-attachments/assets/905c4f9b-cfdb-4e89-ad4e-35f2aa1b4db0" alt="MainApp" width="1500" />

### User Interface
<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="https://github.com/user-attachments/assets/0bafaa8e-083a-4375-a055-e275bf93ba4b" alt="UI Component 1" width="1500" />
  <img src="https://github.com/user-attachments/assets/6fcacaa3-511c-44eb-be59-ce1cff38e29f" alt="UI Component 2" width="1500" />
  <img src="https://github.com/user-attachments/assets/40cf30fa-77a4-49a7-b48a-3d3ce5465fd2" alt="UI Component 3" width="1500" />
</div>

## 📦 Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)
- Git

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rahil9/v16.git
   cd v16
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## 🚀 Development

To start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## 📁 Project Structure

```
├── app/                # Next.js app directory
│   ├── auth/          # Authentication related pages
│   ├── (main)/        # Main application pages
│   ├── layout.tsx     # Root layout
│   └── globals.css    # Global styles
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── public/           # Static assets
└── styles/           # Additional styles
```

## 🛠️ Key Dependencies

- **UI Components**
  - @radix-ui/\* - Comprehensive UI component library
  - tailwindcss - Utility-first CSS framework
  - class-variance-authority - Component styling
  - lucide-react - Icon library

- **Form Handling**
  - react-hook-form - Form state management
  - @hookform/resolvers - Form validation
  - zod - Schema validation

- **Data Visualization**
  - recharts - Charting library

- **Authentication**
  - firebase - Authentication and backend services

## 🧪 Testing

To run the linter:

```bash
pnpm lint
```

## 🔧 Environment Variables

Make sure to set up the following environment variables in your `.env.local` file:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
