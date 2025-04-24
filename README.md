# Code Assistant Overlay

A Chrome extension that provides an intelligent code assistant overlay for coding websites, helping developers understand and analyze code more effectively.

## Features

- **Smart Code Detection**: Automatically detects and highlights code blocks on coding websites
- **Interactive Overlay**: Provides a clean, modern interface for code analysis
- **Language Detection**: Automatically identifies programming languages
- **Code Analysis**: Ask questions about code and get detailed explanations
- **API Integration**: Uses Groq API for intelligent code analysis
- **Customizable Settings**: Configure API keys and other preferences
- **GitHub Integration**: Works seamlessly with GitHub's code view

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to any coding website (e.g., GitHub, Stack Overflow)
2. Click the 💡 button that appears in the bottom right corner
3. Click on any code block to analyze it
4. Type your question in the input field
5. Get instant, detailed explanations about the code

## Configuration

The extension requires a Groq API key for full functionality:

1. Click the settings button in the overlay
2. Enter your Groq API key
3. Click "Save API Key"

## Supported Websites

- GitHub
- Stack Overflow
- And other major coding platforms

## Development

### Project Structure

- `content.js`: Main extension logic and UI implementation
- `manifest.json`: Extension configuration
- `icon.png`: Extension icon

### Building

1. Make sure you have Node.js installed
2. Run `npm install` to install dependencies
3. Make your changes
4. Test the extension in Chrome

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- Uses Groq API for code analysis
- Inspired by modern code review tools 