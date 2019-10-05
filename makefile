SHELL := /bin/bash

all:
	cargo build --target=wasm32-unknown-emscripten --release
	cp target/wasm32-unknown-emscripten/release/deps/ansi2unicode-web.js docs/
	cp target/wasm32-unknown-emscripten/release/deps/ansi2unicode_web.wasm docs/


# Runtime.dynCall to dynCall
