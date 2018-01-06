use domain::model::mesh::Mesh;
use application::stl_reader::binary_stl_reader;
use base64::decode;
use std::fs::File;
use std::io::prelude::*;
use geometry_kernel::bool_op::BoolOpPerformer;


pub fn perform_on_stls(operation_name: &str, figure1_base64: &str, figure2_base64: &str) -> Mesh {
    if !valid_operation(operation_name) {
        panic!("Invalid or not supported operation provided!");
    }

    // create 2 .stl files
    let f1 = create_stl_file("/tmp/f1.stl", figure1_base64);
    let f2 = create_stl_file("/tmp/f2.stl", figure2_base64);

    // perform operation
    let performer = BoolOpPerformer::new(&f1, &f2)
        .expect("The error was raised in a constructor of <BoolOpPerformer>!");
    let res = performer.union();

    let mut f_res= File::create("/tmp/res.stl").unwrap();
    res.write_stl(&mut f_res);

    // convert to my own mesh
    let mut res_content: String;
    f_res.read_to_string(&res_content);

    let res_as_mesh = binary_stl_reader::mesh_from_binary_stl(res_content);
    res_as_mesh
}

fn valid_operation(op_name: &str) -> bool {
    "bad" != op_name
}

fn create_stl_file<'a>(filepath: &'a str, base64_content: &'a str) -> File {
    let mut f = File::create(filepath.to_string()).unwrap();
    let mut content = convert_base_64_string_to_bytes(base64_content);
    f.write_all(&mut content);
    f
}

fn convert_base_64_string_to_bytes(s: &str) -> Vec<u8> {
    decode(s).unwrap()
}
