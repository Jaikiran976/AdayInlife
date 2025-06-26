# 🧾 Frontend – A day In Life

This is the **Angular** frontend for _A day In Life_, a personal diary application that allows users to write, view, and manage daily entries. It includes a rich text editor, theming, reusable components, and API integration for a seamless user experience.

---

## ⚙️ Technologies & Tools

- Angular 19
- SCSS for styling
- Quill rich-text editor (with live preview)
- Custom reusable components (Text-Editor, Dropdown, Calendar, Toast)
- Angular Router & Reactive Forms

---

## 🚀 Getting Started

# 1. Clone the Repository
git clone https://github.com/Jaikiran976/AdayInlife
cd adayinlife/Frontend

# 2. Install Dependencies
npm install

# 3. Start the Development Server
ng serve

Then open http://localhost:4200 in your browser.

# 4.Update the backend API URL in the environment files:

// src/environments/environment.ts for local setup  
export const environment = {
  production: false,
  baseApiUrl:'https://localhost:7113'
};

// src/environments/environment.prod.ts for live setup
export const environment = {
  production: true,
  baseApiUrl:'backendurl'
};

---

## ✨ Frontend Highlights

- 📝 Rich-text diary editor with live preview  
- 🎨 Theme toggle (light/dark mode)  
- 🧩 Custom reusable UI components (Text-Editor, Dropdown, Calendar, Toast)  
- 📱 Responsive design and routing  

For a complete list of features and project overview, please refer to the [main README](../README.md).

---

## 📁 Frontend Structure

Frontend/
├── src/
│   ├── app/
│   │   ├── Guards/                 # Route guards for authentication and authorization
│   │   ├── Models/                 # TypeScript models
│   │   ├── Pages/                  # Views like login, register, diary, etc.
│   │   ├── Services/               # API calls and utility services
│   │   ├── Shared/                 # Shared features across the app
│   │   │   └── components/         # Reusable components (dropdown, calendar, toast)
│   │   └── app.module.ts           # Main Angular module and theme setup
│   ├── assets/                     # Static assets like images, App-wide content
│   ├── environments/               # Environment-specific config (API URLs, flags)
│   └── Styles/                     # Global styles, color variables, breakpoints
├── angular.json                    # Angular CLI configuration
└── README.md                       # Frontend project documentation (this file)

---

## 🙋‍♂️ About

Made with ❤️ by [Jai Kiran](https://jaikiran.netlify.app/)
