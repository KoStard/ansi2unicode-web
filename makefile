SHELL := /bin/bash

all:
	cargo web build
	cp target/wasm32-unknown-unknown/debug/ansi2unicode_web.js site/
	cp target/wasm32-unknown-unknown/debug/ansi2unicode_web.wasm site/
