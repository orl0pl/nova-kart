# ![logo](./logo.svg) NovaKart

New card extension for firefox. Based on [this template](https://github.com/bullet-ant/extensions-with-svelte).

## Installation

First, clone the repository and navigate into the project directory. Then, install the project dependencies with npm:

```sh
npm install
```

## Scripts

This project includes the following scripts in its package.json:

- `dev`: Launches the development server. (may not work as expected with Vite context, read below)
- `build`: Builds the project for production.
- `watch`: Watches for changes in the `src` and `public` directory and triggers a `build` when changes are detected.
- `preview`: Serves the built project locally. (may not work as expected, read below)

> **Note:** The Service Worker is specific to a Chrome extension, so `dev` & `preview` commands may not work as expected in the context of Vite. <br>
> A workaround is to comment out the pieces of code that contain `chrome.runtime` in your Svelte components (if you're not using them in what you're testing). <br>
> Otherwise, just `build` your project and load them in Chrome (steps below) and continue your development.

You can run these scripts with npm. For example, to build the project as soon as something changes in `src` or `public` folder, run:

```sh
npm run watch
```

## Contributing

Contributions are welcome!

## License

This project is licensed under the terms of the [MIT License](LICENSE).
