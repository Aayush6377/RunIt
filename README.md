<div align="center">

# 🚀 RunIt - Code Playground

<a href="https://run-it-nine.vercel.app">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=22&pause=1000&color=D0BCFF&center=true&vCenter=true&width=600&lines=Zero-friction+coding+for+the+modern+web;Write,+execute,+and+share+snippets+instantly;Powered+by+Next.js+15+and+Glot+API" alt="Typing SVG" />
</a>

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-8A2BE2?style=for-the-badge&logo=vercel)](https://run-it-nine.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br />

<video src="./public/demo.mp4" autoplay loop muted playsinline width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"></video>

<br />
<i>High-performance, real-time code execution wrapped in a glassmorphic UI.</i>
<br /><br />

</div>

---

## 💻 Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</div>

---

## ✨ Features

Click to expand and learn more about RunIt's capabilities:

<details>
<summary><b>⚡ Instant Code Execution (8+ Languages)</b></summary>
Write and run code in Python, JavaScript, TypeScript, Java, C++, Rust, Go, and C. Powered by the high-speed Glot API for immediate console outputs.
</details>

<details>
<summary><b>🤝 Role-Based Collaboration Workspace</b></summary>
Share your snippets via secure tokens. Assign precise roles (Co-Owner, Editor, Viewer) to control who can edit metadata, modify code, or invite others to the workspace.
</details>

<details>
<summary><b>🤖 Integrated AI Assistant</b></summary>
Powered by the Google Gemini API. Ask the AI to explain complex code, debug syntax errors, or suggest optimizations directly within the playground sidebar.
</details>

<details>
<summary><b>📊 Data-Driven Interactive Dashboard</b></summary>
Visualize your coding habits. Using Recharts, the dashboard tracks your total snippets, commit history over 14 days, pending invitations, and language distribution.
</details>

<details>
<summary><b>🔐 Advanced Authentication</b></summary>
Seamless login via GitHub OAuth, Google OAuth, or Credentials. Includes a secure, email-based OTP flow for password resets.
</details>

---

## 🚀 Getting Started

Follow these steps to run the playground locally on your machine.

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Database URI
* API Keys for Cloudinary, Gemini, and Glot

### 1. Clone the repository
```bash
git clone https://github.com/Aayush6377/RunIt.git
cd runit
```

### 2. Install dependencies & Setup Environment
```bash
npm install
```

Create a `.env` file in the root directory (you can duplicate the `.env.example` file) and add your keys:

```env
# Database
DATABASE_URL="your_mongodb_connection_string"
NODE_ENV="development"

# NextAuth Configuration
NEXTAUTH_SECRET="your_random_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Email Configuration
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"

# External APIs
GLOT_TOKEN="your_glot_api_token"
GEMINI_API_KEY="your_gemini_api_key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Initialize Database & Run
```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 👨‍💻 Connect with the Developer

**Aayush Kukreja** *Full Stack Developer specializing in MERN & Next.js architectures.*

[![Portfolio](https://img.shields.io/badge/Portfolio-23005C?style=for-the-badge&logo=Vercel&logoColor=white)](https://aayush-kukreja-portfolio.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aayush-kukreja-b5885324a)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Aayush6377)

<div align="center">
  <br />
  <i>If you found this project interesting, please consider giving it a ⭐!</i>
</div>