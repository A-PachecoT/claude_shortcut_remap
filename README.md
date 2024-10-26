# Claude IDE Shortcuts

A Chrome extension that adds customizable keyboard shortcuts to Claude AI's interface, matching ChatGPT's default shortcuts while allowing for personalization.

## Features

- 🎯 Matches ChatGPT's default keyboard shortcuts
- ⌨️ Fully customizable shortcuts
- 🎨 Clean, minimalist interface matching Claude's design
- 💾 Automatic shortcut sync across devices
- 📋 Quick copy functionality for code and responses
- 🔍 Easy-to-access shortcuts viewer (Ctrl + /)

## Default Shortcuts

| Action | Shortcut |
|--------|----------|
| Submit Message | Ctrl + Enter |
| New Line | Shift + Enter |
| Stop Generation | Escape |
| New Chat | Ctrl + Shift + O |
| Custom Instructions | Ctrl + Shift + I |
| Focus Input | Shift + Escape |
| Toggle Sidebar | Ctrl + Shift + S |
| Copy Last Code | Ctrl + Shift + ; |
| Delete Chat | Ctrl + Shift + X |
| Copy Last Response | Ctrl + Shift + C |
| Show Shortcuts | Ctrl + / |

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Customization

1. Click on the extension icon in Chrome
2. Select "Options" from the dropdown
3. Modify shortcuts to your preference
4. Click "Save Changes" to apply

## Files Structure

```
claude-shortcut_remap/
├── manifest.json # Extension configuration
├── content.js # Main shortcut functionality
├── options.html # Settings page layout
└── options.js # Settings page functionality
```


## Brand Colors

The extension uses Claude's official brand colors:

- Primary: `#da7756` (Terra Cotta)
- Primary Dark: `#bd5d3a`
- Background: `#eeece2`
- Text: `#3d3929`

## Development

### Prerequisites

- Google Chrome
- Basic knowledge of JavaScript
- Understanding of Chrome Extension APIs

### Local Development

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes on [Claude AI](https://claude.ai)

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Submit a pull request

## License

MIT License - feel free to use this code in your own projects!

## Acknowledgments

- Inspired by ChatGPT's keyboard shortcuts
- Designed to match Claude AI's aesthetic
- Built with vanilla JavaScript for maximum performance

## Support

If you encounter any issues or have suggestions:
1. Open an issue on GitHub
2. Provide detailed steps to reproduce the problem
3. Include your Chrome version and OS

---

Made with ❤️ for the Claude AI community