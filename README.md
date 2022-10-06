# ShBenchmark

## Tauri
Tauri is a toolkit that helps developers make applications for the major desktop platforms - using virtually any frontend framework in existence. The core is built with Rust, and the CLI leverages Node.js making Tauri a genuinely polyglot approach to creating and maintaining great apps.

## FRONTEND
- sh_benchmark uses angular app that is created with angular-cli as a frontend.
- All the rust code and tauri specific config will be part of `src-tauri` folder.
## RUST
- Rust is needed, as Tauri uses RUST for the backend.
- Follow this guide, to Install Rust: https://tauri.app/v1/guides/getting-started/prerequisites#installing

## Development server
Run `npm run tauri dev` to start the dev server which will start watching the files, will re-build your app and opens it in a desktop window.

## Build
Run `npm run tauri build` to create an Installer for your operating system.
For more Info, read docs: https://tauri.app/v1/guides/building/
