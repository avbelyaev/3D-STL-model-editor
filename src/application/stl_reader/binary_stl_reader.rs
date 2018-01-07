use domain::model::mesh::Mesh;
use domain::model::triangle::Triangle;

use std::io::Cursor;
use std::str;
use byteorder::{LittleEndian, ReadBytesExt};
use std::fs::File;
use std::io::prelude::*;


pub fn mesh_from_binary_stl_file(filepath: &str) -> Mesh {
    let mut file = File::open(filepath).unwrap();

    let h = read_header(&mut file);
    println!("header:{}", h);

    let triang_num = read_size(&mut file);
    println!("size:{}", triang_num);

    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer);
    let mut cursor = Cursor::new(buffer);

    let triangs = read_content(&mut cursor, triang_num);
    println!("content read:{}", triangs.len());

    Mesh { triangles: triangs }
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
        triangles.push(Triangle::from_normal_and_points(&vertex_buf.to_vec()));

        // skip Attribute byte count
        cursor.read_u16::<LittleEndian>().unwrap();
        i += 1;
    }
    triangles
}
