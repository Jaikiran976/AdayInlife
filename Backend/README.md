# 🧾 Backend – A day In Life

This is the **ASP.NET Core Web API** backend for _A day In Life_, a personal diary application. It provides secure user authentication, diary entry management, and communicates with a MongoDB database.

---

## ⚙️ Technologies & Tools

- ASP.NET Core 8.0 Web API  
- Entity Framework Core (MongoDB driver integration or any specific use)  
- MongoDB for data storage  
- JWT Authentication  
- Dependency Injection & Middleware  
- RESTful API design  

---

## 🚀 Getting Started

### 1. Clone the Repository
git clone https://github.com/Jaikiran976/AdayInlife
cd adayinlife/Backend

### 2. Configure Environment Variables
Create a file named `appsettings.Development.json` in the `Backend/` folder and add the following structure:

```json
{
  "FrontendSettings": {
    "FrontendUrl": ""
  },
  "JWTSettings": {
    "SecretKey": "<your 32-character secret key>"
  },
  "MongoDbSettings": {
    "AtlasURI": "mongodb://localhost:27017",
    "DatabaseName": ""
  },
  "EncryptionSettings": {
    "ENCRYPTION_KEY": "<your 32-character encryption key>",
    "ENCRYPTION_IV": "<your 16-character IV>"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
⚠️ Important: Do not commit this file to version control. Add it to .gitignore to keep sensitive credentials secure.

### 3. Restore Dependencies and Build

dotnet restore
dotnet build

### 4. Run the API

dotnet run

By default, the API will run at https://localhost:7113 (or your configured port).

---

## 📁 Backend Structure

Backend/
├── Controllers/                 # API endpoint controllers (Auth, Diary, etc.)
├── Data/                        # MongoDB context and configuration
├── Models/                      # DTOs, configuration classes, and entities
├── Helpers/                     # Utility classes (e.g., JWT helpers)
├── appsettings.Development.json# Environment-specific config file
├── Program.cs                   # Entry point and middleware setup
└── Dockerfile                   # Optional Docker setup (if used) for prod build

---

🔐 Authentication & Security

JWT-based token authentication for secure access

Password hashing and recovery via custom question/answer

---

📚 API Endpoints
Visit:
👉 https://localhost:7113/swagger

Or check the Controllers/ folder to explore individual route logic.

---

## 🙋‍♂️ About

Made with ❤️ by [Jai Kiran](https://jaikiran.netlify.app/)
