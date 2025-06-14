# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Twitch Live Chime is a Chrome Extension that notifies users with sounds and notifications when their favorite Twitch streamers go live.

## Common Commands

```bash
# Build for development with watch
npm run build-dev

# Build for production
npm run build-prod

# Clean build artifacts
npm run clean

# Run tests
npm test

# Lint and format code
npm run lint-fix
```

## Architecture

This project uses a layered architecture with DI container (tsyringe):

- **Domain Layer**: Business logic and abstractions
  - `domain/usecase/`: Application logic (Background, Content, Option, Popup)
  - `domain/model/`: Domain models
  - `domain/infra-interface/`: Infrastructure abstractions

- **Infrastructure Layer**: External API and browser API implementations
  - `infra/browser-api.ts`: Chrome Extension API wrapper
  - `infra/twitch-api.ts`: Twitch API client
  - `infra/service/messaging.ts`: Chrome messaging API

- **Entry Points**: Chrome Extension contexts
  - `entry/background.ts`: Service Worker
  - `entry/content.ts`: Content Script
  - `entry/popup.tsx`: Extension Popup
  - `entry/option.tsx`: Options Page

- **DI Configuration**: 
  - `di/register.ts`: DI container configuration
  - `di/inject-tokens.ts`: Dependency injection tokens

Due to Chrome Extension constraints, each entry point (background, content, popup, option) runs in isolated contexts and communicates via `chrome.runtime.sendMessage`.

## Technology Stack

- TypeScript + React (UI components)
- tsyringe (Dependency Injection)
- Tailwind CSS (Styling)
- Webpack (Build tool)
- Jest (Testing)
- Chrome Extension Manifest V3