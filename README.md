# Parodesign - AI-Powered Chat-to-Diagram

Transform text descriptions into visual diagrams using AI. Simply describe what you want, and watch as your ideas become interactive diagrams in real-time.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🚀 Features

- **Natural Language to Diagrams**: Describe your diagram in plain text, AI generates it automatically
- **Interactive Canvas**: Powered by Tldraw for smooth, infinite canvas experience
- **Smart Layout**: Automatic graph layout using Dagre algorithm
- **Real-time Chat**: Conversational interface with OpenAI GPT
- **Multiple Diagram Types**: Support for flowcharts, process diagrams, decision trees, and more
- **Export Ready**: Built on Tldraw, with native export capabilities

## 🎯 Use Cases

- **Process Documentation**: "Create a user registration flow"
- **System Architecture**: "Show me a microservices architecture with API gateway"
- **Business Workflows**: "Design an e-commerce checkout process"
- **Decision Trees**: "Create a troubleshooting flowchart for customer support"
- **Educational Diagrams**: "Explain how OAuth authentication works"

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.0
- **UI**: React 18.3, TailwindCSS 3.4
- **Canvas**: Tldraw 2.4
- **Layout Engine**: Dagre 1.1
- **AI**: OpenAI GPT-4 (Chat Completions API)
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/davidblanc347/parodesign.git
   cd parodesign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

1. **Start a conversation**: Type your diagram description in the chat panel on the left
   - Example: "Create a login process diagram"
   
2. **AI generates the diagram**: The AI understands your description and creates a structured diagram

3. **View on canvas**: The diagram appears automatically on the Tldraw canvas on the right

4. **Interact and edit**: Use Tldraw's built-in tools to modify, zoom, pan, and export

### Example Prompts

```
"Create a simple authentication flow with email and password"
"Show me a flowchart for processing a customer order"
"Design a decision tree for technical support escalation"
"Create a diagram showing the software development lifecycle"
```

## 📁 Project Structure

```
parodesign/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── features/          # Feature components
│   │   │   ├── ChatPanel.tsx  # Chat interface
│   │   │   └── TldrawCanvas.tsx # Canvas wrapper
│   │   └── ui/                # UI components
│   │       ├── ChatInput.tsx  # Message input
│   │       └── ChatMessage.tsx # Message display
│   ├── hooks/
│   │   └── useChatAPI.ts      # OpenAI API integration
│   ├── lib/
│   │   ├── chat-prompts.ts    # AI system prompts
│   │   ├── diagram-parser.ts  # JSON extraction
│   │   ├── layout-engine.ts   # Dagre layout
│   │   ├── openai-config.ts   # API configuration
│   │   └── tldraw-helpers.ts  # Canvas utilities
│   └── types/
│       └── graph.ts           # TypeScript types
├── .env.example               # Environment template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
└── package.json              # Dependencies
```

## 🔧 Configuration

### OpenAI API

The application uses OpenAI's Chat Completions API (not the Realtime API). Configure the model in `src/lib/openai-config.ts`:

```typescript
export const OPENAI_CONFIG = {
  model: 'gpt-4-turbo-preview',  // Change model here
  temperature: 0.7,               // Adjust creativity
  maxTokens: 2000,               // Response length
};
```

### Diagram Types

Supported node types in `src/types/graph.ts`:
- `start`: Beginning of process
- `process`: Action or step
- `decision`: Yes/no branches
- `data`: Data elements
- `end`: Terminal points

## 🚦 Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code)
- Powered by [OpenAI GPT](https://openai.com)
- Canvas by [Tldraw](https://tldraw.com)
- Layout by [Dagre](https://github.com/dagrejs/dagre)

## 🐛 Known Issues

- First diagram generation may take a few seconds
- Complex diagrams with many nodes may require manual layout adjustments

## 🗺️ Roadmap

- [ ] Add diagram templates
- [ ] Support for multiple diagram styles
- [ ] Export to PNG/SVG/PDF
- [ ] Collaborative editing
- [ ] Diagram history and versioning
- [ ] Custom node types and styling
- [ ] Integration with diagram.net format

---

**Built with ❤️ using Claude Code**

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
