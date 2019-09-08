#![feature(proc_macro)]

#[macro_use]
extern crate stdweb;

use stdweb::js_export;
use stdweb::web::FileReader;
use stdweb::web::FileReaderResult;

#[js_export]
fn print_result(file_reader: FileReader) -> String {
    match file_reader.result() {
        Some(value) => match value {
            FileReaderResult::String(value) => value,
            _ => String::from("not a text"),
        }
        None => String::from("empty")
    }
}

fn main() {
    stdweb::initialize();

    stdweb::event_loop();
}
