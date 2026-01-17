# CICD Template Generator 🚀

A production-ready web application designed to generate opinionated, best-practice CI/CD YAML templates. It utilizes the Google Gemini API to craft tailored pipeline configurations for various cloud providers, application types, and DevOps platforms.

## ✨ Features

*   **Cloud Agnostic**: Supports AWS, Azure, and GCP.
*   **Versatile**: Covers Backends, Frontends, Containers, Infrastructure, and Data pipelines.
*   **AI-Powered**: Uses Google Gemini to ensure valid, commented, and secure configurations.
*   **Interactive UI**: Step-by-step wizard with drag-and-drop environment ordering.
*   **Exportable**: Download generated templates as a ZIP archive.
*   **Smart Explanations**: Generates human-readable summaries of complex pipelines.

## 🛠️ Prerequisites

Before running the application, ensure you have the following installed:

*   **Node.js**: v18.0.0 or higher.
*   **npm** or **yarn**.
*   **Google Gemini API Key**: You need a valid API key from [Google AI Studio](https://aistudio.google.com/).

## 🏃‍♂️ How to Run Locally

This project is built with React and TypeScript. We recommend using **Vite** for the best local development experience.

### 1. Setup the Project

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd cicd-template-generator
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *If `package.json` is missing, initialize a project and install required libraries:*
    ```bash
    npm init -y
    npm install react react-dom @google/genai lucide-react jszip
    npm install -D typescript vite @vitejs/plugin-react tailwindcss postcss autoprefixer
    ```

### 2. Configure Environment Variables

The application requires a valid API Key to function. It looks for `process.env.API_KEY`.

**Method A: Using Vite (Recommended)**

1.  Create a `.env` file in the root directory.
2.  Add your API key (Note: For security in production, this should be handled by a backend proxy, but for local demos, you can configure your bundler to expose it):
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```
3.  *Note:* If using Vite standard mode, you might need to update `vite.config.ts` to define `process.env` or use a plugin like `vite-plugin-environment`.

**Method B: Inline Environment Variable**

Mac/Linux:
```bash
export API_KEY="your_google_gemini_api_key_here"
npm run dev
```

Windows (PowerShell):
```powershell
$env:API_KEY="your_google_gemini_api_key_here"
npm run dev
```

### 3. Start the Server

```bash
npm run dev
```

Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

## 🚀 Deployment on Vercel

This application is optimized for deployment on Vercel.

1.  **Push your code to GitHub.**
2.  **Import the project in Vercel:**
    *   Go to the Vercel Dashboard and click "Add New... > Project".
    *   Select your GitHub repository.
3.  **Configure Environment Variables:**
    *   In the "Environment Variables" section of the Vercel deployment screen.
    *   Add a new variable named `API_KEY`.
    *   Paste your Google Gemini API Key as the value.
4.  **Deploy:**
    *   Click "Deploy".
    *   Vercel will detect Vite and build the application automatically.

*Note: The `vite.config.ts` included in this project is configured to read the `API_KEY` from the build environment and inject it into the application, ensuring it works seamlessly in production.*

## 🏗️ Project Structure

*   `App.tsx`: Main application entry point and layout shell.
*   `components/StepWizard.tsx`: The interactive multi-step form for user configuration.
*   `components/ResultsView.tsx`: Displays the generated YAML, handles syntax highlighting (via simple pre), and ZIP downloads.
*   `services/geminiService.ts`: Handles communication with the Google GenAI SDK to generate and explain templates.
*   `types.ts`: TypeScript definitions for the application state and domain models.
*   `constants.ts`: Static configuration for UI options (Cloud providers, Icons, etc.).
*   `vite.config.ts`: Configuration for the build process and environment variable handling.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Vibe coded by Arjun . Happy Coding.