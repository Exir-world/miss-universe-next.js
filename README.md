# Miss Next.js

A multi-language, multi-tenant Next.js application with task, quiz, and profile management features.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Docker Usage](#docker-usage)
- [Internationalization (i18n)](#internationalization-i18n)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Multi-language support (i18n)
- User profile and referral system
- Task and quiz management
- Transaction history
- Responsive UI with Tailwind CSS
- Docker support for easy deployment

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jenkins](https://www.jenkins.io/) (CI/CD)
- [Docker](https://www.docker.com/)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

```bash
git clone https://github.com/yourusername/miss-nextjs.git
cd miss-nextjs
npm install
# or
yarn install
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
miss-nextjs/
  ├── src/
  │   ├── app/                # Next.js app directory (routes, pages, API)
  │   ├── components/         # Reusable React components
  │   ├── context/            # React context providers
  │   ├── hooks/              # Custom React hooks
  │   ├── i18n/               # Internationalization config
  │   ├── lib/                # Utility libraries
  │   ├── stores/             # State management (stores)
  │   └── middleware.ts       # Next.js middleware
  ├── messages/               # Translation files (JSON)
  ├── public/                 # Static assets (SVGs, favicons)
  ├── Dockerfile              # Docker configuration
  ├── Jenkinsfile             # Jenkins CI/CD pipeline
  ├── tailwind.config.js      # Tailwind CSS config
  ├── next.config.ts          # Next.js config
  └── ...
```

## Environment Variables

Create a `.env` file in the root and add necessary environment variables. (List required variables here if any.)

## Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint

## Docker Usage

To build and run the app with Docker:

```bash
docker build -t miss-nextjs .
docker run -p 3000:3000 miss-nextjs
```

## Internationalization (i18n)

- Translation files are in `/messages` (e.g., `en.json`, `fr.json`, etc.)
- i18n configuration is in `src/i18n/`

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

## License

[MIT](LICENSE) (or specify your license)


