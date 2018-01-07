use domain::model::mesh::Mesh;
use application::stl_reader::binary_stl_reader;
use std::fs::File;
use std::io::prelude::*;
use geometry_kernel::primitives::mesh;
use geometry_kernel::bool_op::BoolOpPerformer;


pub fn perform_on_stls(operation_name: &str, stl1_bytes: Vec<u8>, stl2_bytes: Vec<u8>) -> Mesh {
    if !valid_operation(operation_name) {
        panic!("Invalid or not supported operation provided!");
    }

    // create 2 stl files
    let mut f1 = create_stl_file("/tmp/f1.stl", stl1_bytes);
    let mesh1 = mesh::BinaryStlFile::read_stl(&mut f1).unwrap();

    let mut f2 = create_stl_file("/tmp/f2.stl", stl2_bytes);
    let mesh2 = mesh::BinaryStlFile::read_stl(&mut f2).unwrap();


    // perform operation
    let performer = BoolOpPerformer::new(&mesh1, &mesh2)
        .expect("The error was raised in a constructor of <BoolOpPerformer>!");
    let res = performer.union();


    // write STL to file since geometry_kernel uses it's own Number impl
    // and it's easier to parse output file to extract Mesh of my own type
    let res_path = "/tmp/res.stl";
    let mut f_res= File::create(res_path).unwrap();
    res.write_stl(&mut f_res);

    binary_stl_reader::mesh_from_binary_stl_file(res_path)
}

fn valid_operation(op_name: &str) -> bool {
    "bad" != op_name
}

fn create_stl_file<'a>(filepath: &'a str, content: Vec<u8>) -> File {
    let mut f = File::create(filepath.to_string()).unwrap();
    f.write_all(&content);

    File::open(filepath).unwrap()
}
