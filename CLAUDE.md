# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LingShu-frontend is a React + TypeScript frontend for a data integration platform. It provides a web interface for managing channels that handle data transformation and routing between different sources and destinations.

## Development Commands

- `yarn dev` - Start the development server with hot reload
- `yarn build` - Build the production application (runs TypeScript compiler then Vite build)
- `yarn lint` - Run ESLint to check code quality
- `yarn preview` - Preview the built application locally

## Architecture

### Tech Stack
- **Frontend**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.0.0
- **UI Library**: Material-UI (MUI) 7.1.2 with dark theme
- **Routing**: React Router DOM 7.6.2
- **HTTP Client**: Axios 1.10.0
- **Internationalization**: react-i18next 13.0.0 with English and Chinese support

### Project Structure
```
src/
├── api/           # API layer with typed interfaces
│   └── channels.ts  # Channel management API functions
├── assets/        # Static assets and translation files
│   ├── en.json     # English translations
│   └── zh.json     # Chinese translations
├── pages/         # Page components
│   ├── ChannelForm.tsx    # Channel creation/editing form
│   └── ChannelsList.tsx   # Channel management table
├── App.tsx        # Main application component with routing
├── main.tsx       # Application entry point with theme setup
└── i18n.ts        # Internationalization configuration
```

### Key Components

**Channel Management System**
- Channels represent data integration pipelines with sources, filters, transformers, and destinations
- Supports HTTP and TCP sources/destinations
- Python script-based filters and transformers
- CRUD operations via REST API

**Data Models**
- `ChannelModel`: Core channel configuration
- `SourceConfig`: HTTP/TCP source configurations
- `FilterConfig`: Python script filters
- `TransformerConfig`: Python script transformers
- `DestinationConfig`: HTTP/TCP destination configurations

### Backend Integration
- API base URL: `http://localhost:8000` (FastAPI backend)
- All API calls use Axios with proper TypeScript typing
- Error handling implemented for network requests

### Internationalization
- Default language: Chinese (zh)
- Fallback language: English (en)
- Language selector in app bar
- Translation keys organized by feature

### Development Notes
- Material-UI dark theme applied globally
- Server configured to bind to `0.0.0.0` for external access
- Strict mode enabled for React development
- ESLint configured for code quality