use domain::model::triangle::Triangle;
use byteorder::{LittleEndian, ReadBytesExt};


pub trait AbstractStlReader {
    fn new(bytes: Vec<u8>) -> Self;

    fn read_header<T: ReadBytesExt>(&self, cursor_to_content: &mut T) -> String;

    fn read_content<T: ReadBytesExt>(&self, cursor_to_content: &mut T) -> &Vec<Triangle>;
}