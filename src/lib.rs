use std::{io::Cursor};

use wasm_bindgen::prelude::*;
use ansi2unicode::Translator;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    fn save_txt(name: &str, value: Vec<u8>);
    fn save_zip(name: &str, value: Vec<u8>);
}

#[wasm_bindgen]
pub fn convert_file(name: String, bytes_r: Vec<u8>) -> String {
    let mut bytes: Cursor<Vec<u8>> = Cursor::new(bytes_r);
    bytes.set_position(0);
    let parts = (name[..]).split(".");
    match parts.last() {
        Some("docx") => match Translator::translate_docx_from_stream(&mut bytes) {
            Ok(value) => {
                log(&format!("{} bytes in the output file", value.len()));
                save_zip(&name, value);
                String::from("Done")
            }
            Err(e) => String::from(format!("Could not translate, {:?}!", e)),
        },
        Some("pptx") => match Translator::translate_pptx_from_stream(&mut bytes) {
            Ok(value) => {
                log(&format!("{} bytes in the output file", value.len()));
                save_zip(&name, value);
                String::from("Done")
            }
            Err(e) => String::from(format!("Could not translate, {:?}!", e)),
        },
        Some("txt") => match Translator::translate_txt_from_stream(&mut bytes) {
            Ok(value) => {
                log(&format!("{} bytes in the output file", value.len()));
                save_txt(&name, value);
                String::from("Done")
            }
            Err(e) => String::from(format!("Could not translate, {:?}!", e)),
        },
        _ => String::from("Unknown type!"),
    }
}
