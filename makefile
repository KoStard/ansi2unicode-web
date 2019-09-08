SHELL := /bin/bash

all:
	cargo build --target=wasm32-unknown-emscripten --release
	cp target/wasm32-unknown-emscripten/release/deps/ansi2unicode_web.wasm site/
	cp target/wasm32-unknown-emscripten/release/deps/ansi2unicode-web.js site/


# Runtime.dynCall to dynCall
