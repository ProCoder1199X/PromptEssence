<div align="center">

# ⚡ PromptBridge

### Transform Messy Thoughts into Crystal-Clear AI Prompts

<img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />

</div>

---

## 🎯 What is PromptBridge?

**PromptBridge** is an intelligent prompt optimization tool that transforms your rough, unstructured ideas into professionally crafted prompts for any AI assistant. No more struggling to articulate what you need—just dump your thoughts, and let AI refine them.

### ✨ Key Features

- **🧠 Smart Optimization** - Extracts true intent from messy input
- **⚡ Lightning Fast** - Powered by Google's Gemini 2.5 Flash
- **🎨 Beautiful UI** - Modern dark theme with smooth animations
- **📋 One-Click Copy** - Instantly copy optimized prompts
- **🔒 Privacy First** - Your prompts are processed securely
- **💡 Context Aware** - Maintains technical accuracy for code and structured tasks

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/promptbridge.git
cd promptbridge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 📦 Project Structure

```
promptbridge/
├── components/          # React components
│   ├── Button.tsx      # Reusable button with variants
│   ├── Header.tsx      # App header with branding
│   └── PromptEditor.tsx # Main editor interface
├── services/           # External service integrations
│   └── geminiService.ts # Gemini API integration
├── App.tsx             # Root component
├── constants.ts        # App configuration
├── types.ts            # TypeScript type definitions
├── index.html          # HTML entry point
├── index.tsx           # React entry point
└── vite.config.ts      # Vite configuration
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Type Checking
npx tsc --noEmit     # Run TypeScript type checker
```

---

## 🎨 Customization

### Changing the System Prompt

Edit `constants.ts` to modify how PromptBridge optimizes prompts:

```typescript
export const SYSTEM_PROMPT = `
  Your custom optimization instructions...
`;
```

### Styling

The app uses Tailwind CSS with a custom dark theme. Modify colors in `index.html`:

```javascript
colors: {
  background: '#0A0A0A',
  accent: '#2D7DFF',
  // Add your custom colors
}
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_api_key_here
```

### Gemini Model Selection

Change the model in `constants.ts`:

```typescript
export const GEMINI_MODEL = "gemini-2.5-flash"; // or gemini-2.5-pro
```

---

## 📖 Usage Examples

### Before Optimization
```
I need a python script to scan a pdf and extract names 
but make it handle errors and save to csv
```

### After Optimization
```
Create a Python script with the following requirements:
1. Read and parse PDF files
2. Extract all person names from the content
3. Implement comprehensive error handling for:
   - File not found errors
   - PDF parsing errors
   - Name extraction failures
4. Save extracted names to a CSV file with proper formatting
5. Include logging for debugging purposes

The script should be modular and include proper documentation.
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- Powered by [Google Gemini API](https://ai.google.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Bundled with [Vite](https://vitejs.dev/)

---

## 📧 Support

Have questions or need help? 

- 📫 Open an issue on [GitHub](https://github.com/yourusername/promptbridge/issues)
- 💬 Start a discussion in [Discussions](https://github.com/yourusername/promptbridge/discussions)

---

<div align="center">

**Made with ❤️ by developers, for developers**

⭐ Star this repo if you find it helpful!

</div>
