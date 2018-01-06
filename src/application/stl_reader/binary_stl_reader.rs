use domain::model::mesh::Mesh;
use domain::model::triangle::{Triangle, TriangleFactory};

use std::io::Cursor;
use base64::decode;
use std::str;
use byteorder::{LittleEndian, ReadBytesExt};


pub fn mesh_from_binary_stl(stl_content: &str) -> Mesh {

    let bytes = convert_base64_string_to_bytes(stl_content);
    let mut cursor = Cursor::new(bytes);

    let h = read_header(&mut cursor);
    println!("h:{}", h);

    let triang_num = read_size(&mut cursor);
    println!("s:{}", triang_num);

    let triangs = read_content(&mut cursor, triang_num);

    Mesh { triangles: triangs }
}

/// Unwraps base64 encoded string into vector of bytes
fn convert_base64_string_to_bytes(str: &str) -> Vec<u8> {
    decode(str).unwrap()
}


fn read_header<T: ReadBytesExt>(cursor: &mut T) -> String {
    let mut u8buf = [0u8; 80];
    cursor.read(&mut u8buf);

    str::from_utf8(&u8buf).unwrap().to_string()
}

fn read_size<T: ReadBytesExt>(cursor: &mut T) -> u32 {
    cursor.read_u32::<LittleEndian>().unwrap()
}

fn read_content<T: ReadBytesExt>(cursor: &mut T, content_len: u32) -> Vec<Triangle> {
    let mut triangles = Vec::new();
    let mut i = 0;
    while i < content_len {

        let mut vertex_buf = [0f32; 12];
        cursor.read_f32_into::<LittleEndian>(&mut vertex_buf);
        triangles.push(TriangleFactory::from_normal_and_points(&vertex_buf.to_vec()));

        // skip Attribute byte count
        cursor.read_u16::<LittleEndian>().unwrap();
        i += 1;
    }
    triangles
}
