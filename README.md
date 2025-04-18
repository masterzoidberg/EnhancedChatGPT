# ChatGPT Enhancer

A Chrome Extension that enhances ChatGPT with additional features for prompt management and quick access.

## Features

- **Prompt Management**: Organize your prompts into folders and categories
- **Quick Access Bar**: Access your favorite prompts with a single click
- **Overlay Panel**: Manage prompts and folders without leaving the chat interface
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Customizable Settings**: Toggle features on/off based on your preferences

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/chatgpt-enhancer.git
   cd chatgpt-enhancer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory from this project

## Development

### Project Structure

```
src/
├── background/     # Background script
├── components/     # React components
├── content/        # Content scripts
├── popup/          # Extension popup
├── styles/         # CSS styles
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build the extension
- `npm run preview`: Preview the built extension
- `npm run test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/reference/) 