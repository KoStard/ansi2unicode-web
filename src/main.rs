#[macro_use]
extern crate stdweb;

use stdweb::web::{FileReader, document, TypedArray};
use stdweb::web::FileReaderResult;
use ansi2unicode::Translator;
use std::io::Cursor;

fn save_zip(name: &str, value: Vec<u8>) {
    let arr: TypedArray<u8> = (value[..]).into();
    js!{
        let data = @{arr};
        let blob = new Blob([data], {type: "application/zip"});
        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, @{name.clone()});
        } else {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display:none";
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = @{name.clone()};
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        }
    }
}

fn save_txt(name: &str, value: Vec<u8>) {
    let arr: TypedArray<u8> = (value[..]).into();
    js!{
        let data = @{arr};
        let blob = new Blob([data], {type: "application/txt"});
        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, @{name.clone()});
        } else {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display:none";
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = @{name.clone()};
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        }
    }
}

fn get_file(name: String, file_reader: FileReader) -> String {
    match file_reader.result() {
        Some(value) => {
            match value {
                FileReaderResult::ArrayBuffer(value) => {
                    let mut bytes: Cursor<Vec<u8>> = Cursor::new(value.into());
                    bytes.set_position(0);
                    let parts = (name[..]).split(".");
                    match parts.last() {
                        Some("docx") => {
                            match Translator::translate_docx_from_stream(&mut bytes) {
                                Ok(value) => {
                                    save_zip(&name, value);
                                    String::from("Done")
                                },
                                Err(e) => String::from(format!("Could not translate, {:?}!", e))
                            }
                        },
                        Some("pptx") => {
                            match Translator::translate_pptx_from_stream(&mut bytes) {
                                Ok(value) => {
                                    save_zip(&name, value);
                                    String::from("Done")
                                },
                                Err(e) => String::from(format!("Could not translate, {:?}!", e))
                            }
                        },
                        Some("txt") => {
                            match Translator::translate_txt_from_stream(&mut bytes) {
                                Ok(value) => {
                                    save_txt(&name, value);
                                    String::from("Done")
                                },
                                Err(e) => String::from(format!("Could not translate, {:?}!", e))
                            }
                        },
                        _ => String::from(format!("Unknown type!"))
                    }

                },
                _ => String::from("Not a text")
            }
        },
        None => String::from("Empty")
    }
}

fn main() {
    stdweb::initialize();

    js!{
        document.getElementById("file-input")
            .addEventListener("change",
                function(e) {
                    let reader = new FileReader();
                    reader.onloadend = () => console.log(@{get_file}(e.target.files[0].name, reader));
                    reader.readAsArrayBuffer(e.target.files[0]);
                }
            );
    }

    stdweb::event_loop();
}
