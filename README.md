# Team 2 Job App Frontend

A modern Node.js TypeScript application with ES modules, Express server, and Biome tooling.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **ES Modules**: Modern JavaScript module system
- **Express**: Fast, unopinionated web framework for Node.js
- **Biome**: Lightning-fast formatter, linter, and more for web projects
- **tsx**: Fast TypeScript execution for development
- **Modern Node.js**: Latest JavaScript features (ES2022)
- **Strict Configuration**: Comprehensive TypeScript compiler options

## 📦 Project Structure
```
├── src/
│   └── index.ts          # Express server entry point
├── dist/                 # Compiled JavaScript output
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── biome.json           # Biome configuration
└── .gitignore           # Git ignore rules
```

## 🛠️ Available Scripts

- **`npm run dev`**: Run the Express server in development mode with tsx
- **`npm run build`**: Compile TypeScript to JavaScript
- **`npm start`**: Run the compiled JavaScript application
- **`npm run type-check`**: Type check without emitting files
- **`npm run lint`**: Check code with Biome linter
- **`npm run lint:fix`**: Fix linting and formatting issues automatically
- **`npm run format`**: Format code with Biome
- **`npm run check`**: Run Biome check (lint + format)

## 🔧 Development

1. **Development Mode**: Use `npm run dev` to start the Express server with hot reloading
2. **Code Quality**: Use `npm run check` to lint and format code with Biome
3. **Type Checking**: Run `npm run type-check` to validate TypeScript without compilation
4. **Production Build**: Use `npm run build` to compile for production

## 🌐 API Endpoints

- **GET `/`**: Hello World endpoint with app information
- **GET `/health`**: Health check endpoint with server status

## 🏗️ Tech Stack

- **Node.js**: Runtime environment
- **TypeScript**: Type-safe JavaScript
- **Express**: Web application framework
- **Biome**: Fast formatter and linter
- **tsx**: TypeScript execution engine
- **ES Modules**: Modern module system

## 📝 Configuration

The project uses modern configurations:

### TypeScript (`tsconfig.json`)
- ES2022 target and lib
- ESNext modules with bundler resolution
- Strict type checking enabled
- Source maps and declarations generated

### Biome (`biome.json`)
- Single quotes for JavaScript/TypeScript
- 2-space indentation
- 100 character line width
- Strict linting rules with error on unused variables
- Import organization enabled