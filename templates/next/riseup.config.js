const { next } = require('@riseup/next');
const {
  logo,
  fonts,
  app,
  manifest,
  breakpoints
} = require('./application.config');

module.exports = next(
  {
    global: {
      // Enable prettier
      prettier: true,
      // Enable Next telemetry
      telemetry: false,
      // Path aliases -must be set in tsconfig too
      alias: { '@src': './src' }
    },
    public: {
      // Clean all contents of destination folder
      clean: true,
      // Destination folder for all assets
      destination: 'public',
      // Array of globs for files to copy to public folder
      assets: ['static/*'],
      // Google fonts to download -see: https://bit.ly/2TREByt
      fonts: {
        // Fonts display
        display: 'swap',
        // Fonts subsets
        subsets: ['latin-ext'],
        // Font families object
        families: fonts
      },
      // Build favicons and manifest
      favicons: {
        // Path of source image
        logo,
        // Favicons options
        options: {
          appName: manifest.name,
          appShortName: manifest.shortName,
          appDescription: manifest.description,
          ...manifest
        }
      },
      // Result json
      result: {
        // Base url for assets
        url: app.url,
        // File path for result
        path: 'src/vendor/result.json',
        // Serializable content
        values: { app, manifest, breakpoints }
      }
    },
    watch: {
      // Clear screen on changes
      clear: true,
      // Array of paths to watch
      include: ['./']
    },
    explore: {
      // Build directory to explore sources
      dir: 'build'
    },
    size: {
      // Build directory to analyze size
      dir: 'build',
      // Fail when code assets go over the limit
      limit: '512 kB'
    },
    fix: {
      // Directories to fix
      dir: ['src/', 'test/']
    },
    lint: {
      // Run type checks
      types: true,
      // Directories to lint
      dir: ['src/', 'test/'],
      // Keywords that should output warnings
      highlight: ['fixme', 'todo', 'refactor'],
      // ESLint rules overwrites
      rules: {}
    },
    lintmd: {
      // Glob of markdown files to lint
      include: './README.md',
      // Configuration overrides for markdownlint
      overrides: {}
    },
    test: {
      // Whether to print all passed tests
      verbose: false,
      // Regex array of files to ignore
      ignore: [],
      // Array of setup files
      require: [],
      // Files to include in coverage (auto, all, or none)
      coverage: 'auto',
      // Fail when coverage is under the threshold
      threshold: 0,
      // Configuration overrides for Jest
      overrides: {}
    },
    release: {
      // Conventional commits preset
      preset: 'angular',
      // Generate changelog upon release (version bump)
      changelog: true
    }
  },
  {
    babel: (config) => config,
    typescript: (config) => config,
    eslint: (config) => config,
    jest: (config) => config,
    markdownlint: (config) => config
  }
);
