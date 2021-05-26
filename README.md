# ANSI2Unicode
Using ansi2unicode-rs with WASM and publishing it with github pages.

- You can drag and drop the file or select one by clicking on the box.
- No data is sent to any server, so this tool is safe!
- It is using rust with WASM, so it is very fast!

You can access the website with this link - https://kostard.github.io/ansi2unicode-web/

## Development
### Building the package
- Install node, npm
- Install wasm-pack
- `wasm-pack`
- `cd www/`
- `npm install`
- `npm run-script build` - you will get everything you need inside the docs folder
- Before pushing, update the `www/sw.js` file with the new name of the wasm file and run `npm run-script build` again