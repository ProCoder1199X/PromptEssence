# PromptBridge ⚡

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=flat&logo=tailwind-css)


**AI understands you now.**  
PromptBridge transforms messy, unstructured thoughts into crystal-clear, optimized prompts ready for any LLM (ChatGPT, Claude, Gemini, etc.).

---

## 🚀 Features

*   **Premium UI/UX:** A modern, dark-mode "startup" aesthetic featuring glassmorphism, smooth animations, and electric blue accents.
*   **Instant Optimization:** Powered by Google's **Gemini 2.5 Flash** model for lightning-fast prompt restructuring.
*   **Smart Parsing:** Detects hidden constraints and missing context in your raw input.
*   **Developer Friendly:** Keyboard shortcuts (`Ctrl/Cmd + Enter`), easy clipboard copying, and raw text mode.
*   **Privacy Focused:** Client-side processing structure; your API keys are handled securely within your environment.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS (Dark Mode)
*   **AI Model:** Google Gemini API (`gemini-2.5-flash`)
*   **Build Tooling:** Vite / ESM

## 📸 Usage

1.  **Input:** Type your raw idea into the "Messy Thought" panel.
    *   *Example:* "I need a python script to scan a pdf and extract names but make it handle errors and save to csv"
2.  **Optimize:** Click **"Optimize Prompt ✨"** or press `Ctrl + Enter`.
3.  **Result:** Receive a structured, professional prompt in the "Optimized Prompt" panel.
4.  **Copy:** Click the copy button and paste it into your favorite AI tool.

## 📦 Getting Started

### Prerequisites

*   Node.js installed.
*   A Google Gemini API Key (Get one [here](https://aistudio.google.com/app/apikey)).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/prompt-bridge.git
    cd prompt-bridge
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your API Key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```
    *(Note: For production deployments like Vercel, add this to your project's Environment Variables settings)*

4.  **Run the App**
    ```bash
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

