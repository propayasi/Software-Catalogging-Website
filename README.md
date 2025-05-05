# Software Component Catalog - ReactJS & Firebase

A web-based software component cataloging application built with ReactJS and Firebase. This application allows users to manage and search for reusable software components.

## 🔧 Technologies Used

- ReactJS
- Firebase (Authentication, Realtime Database, Storage)

## 🚀 Getting Started

To run this project locally, follow these steps:

### ✅ Prerequisites

- Node.js and npm installed on your machine.

### 📥 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/software-component-cataloguing-software.git
   cd software-component-cataloguing-software
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a Firebase project in [Firebase Console](https://console.firebase.google.com/).
   - Replace the placeholder values in `src/firebase.js`:
     ```js
     const firebaseConfig = {
       apiKey: 'YOUR_API_KEY',
       authDomain: 'your-project-id.firebaseapp.com',
       databaseURL: 'https://your-project-id.firebaseio.com',
       projectId: 'your-project-id',
       storageBucket: 'your-project-id.appspot.com',
       messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
       appId: 'YOUR_APP_ID',
     };
     ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
software-component-cataloguing-software/
├── public/
├── src/
│   ├── components/
│   │   ├── addcomponent/
│   │   │   ├── addcomponent.js
│   │   │   └── addcomponent.css
│   │   ├── admin/
│   │   ├── adminlogin/
│   │   ├── allcomponents/
│   │   ├── collections/
│   │   ├── dashboard/
│   │   ├── header/
│   │   ├── home/
│   │   ├── login/
│   │   ├── profile/
│   │   ├── searchbar/
│   │   └── view/
│   ├── firebase.js
│   ├── global.css
│   ├── index.js
│   └── reportWebVitals.js
├── package.json
├── package-lock.json
└── README.md
```

---

## ✨ Features

- 🔐 User authentication with Firebase
- 📦 Add/Edit/Delete software components
- 🔍 Search and filter components
- ⚡ Realtime updates (Firebase Realtime DB)
- 📁 Upload and store assets in Firebase Storage

---

## 📦 Deployment

This app can be deployed on:
- Firebase Hosting
- Netlify
- Vercel

You may use `npm run build` and deploy the `build/` folder to your chosen hosting service.

---

## 🤝 Contributing

Contributions are welcome! Fork this repo and create a pull request.

---

## 📜 License

[MIT](LICENSE)