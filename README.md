# PromptBridge

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=flat&logo=tailwind-css)

PromptBridge is a cutting-edge tool designed to transform unstructured ideas into clear, optimized prompts suitable for any large language model (LLM), including ChatGPT, Claude, and Gemini.

---

## Features

- **Modern User Interface:** A sleek, dark-mode design with glassmorphism effects and smooth animations.
- **Prompt Optimization:** Leverages the power of Google's Gemini 2.5 Flash model for fast and accurate prompt restructuring.
- **Context Awareness:** Automatically identifies missing details and constraints in your input.
- **Developer Tools:** Includes keyboard shortcuts (e.g., `Ctrl/Cmd + Enter`), clipboard functionality, and raw text mode.
- **Privacy First:** All processing is client-side, ensuring your data remains secure.

## Technology Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS (Dark Mode)
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`)
- **Build System:** Vite with ESM support

## Usage Instructions

1. **Input:** Enter your raw idea into the "Messy Thought" panel.
   - *Example:* "I need a Python script to scan a PDF, extract names, handle errors, and save the results to a CSV file."
2. **Optimize:** Click the "Optimize Prompt" button or press `Ctrl + Enter`.
3. **Output:** View the refined, structured prompt in the "Optimized Prompt" panel.
4. **Copy:** Use the copy button to transfer the optimized prompt to your preferred AI tool.

## Getting Started

### Prerequisites

- Node.js installed on your system.
- A Google Gemini API Key. Obtain one [here](https://aistudio.google.com/app/apikey).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/prompt-bridge.git
   cd prompt-bridge
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment:
   Create a `.env` file in the root directory and add your API Key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```
   For production deployments (e.g., Vercel), add this key to your project's environment variables.
4. Run the application:
   ```bash
   npm run dev
   ```

## Contributing

We welcome contributions to enhance PromptBridge. To contribute:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add YourFeatureName'`).
4. Push the branch to your fork (`git push origin feature/YourFeatureName`).
5. Open a pull request for review.

## License

This project is licensed under the [MIT License](LICENSE).

