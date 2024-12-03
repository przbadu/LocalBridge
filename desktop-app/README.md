# N8N Launcher

A cross-platform desktop application to easily access your n8n workflow interface without remembering IP addresses and ports.

## Features

- Save your n8n server IP address and port
- Automatic loading of your n8n workflow interface
- Cross-platform support (macOS, Windows, Linux)
- Persistent settings storage

## Development

### Prerequisites

- Node.js (v14 or later)
- npm

### Setup

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

### Running the Application

To run the application in development mode:
```bash
npm start
```

### Building the Application

To build for all platforms:
```bash
npm run build
```

To build for specific platforms:
```bash
# For macOS
npm run build:mac

# For Windows
npm run build:win

# For Linux
npm run build:linux
```

## Usage

1. Launch the application
2. On first run, you'll be prompted to enter your n8n server details:
   - IP Address (e.g., 192.168.1.100)
   - Port (e.g., 4567)
3. Click "Save Settings" to connect to your n8n server
4. The application will remember your settings for future launches

## License

MIT
