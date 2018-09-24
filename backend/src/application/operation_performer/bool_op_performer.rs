use domain::model::mesh::Mesh;
use application::stl_reader::binary_stl_reader;
use std::fs::File;
use std::io::prelude::*;
use geometry_kernel::primitives::mesh;


pub fn perform_on_stls(operation_name: &str, stl1_filepath: &str, stl2_filepath: &str) -> String {
    if !valid_operation(operation_name) {
        panic!("Invalid or not supported operation provided!");
    }

    // create 2 stl files
    println!("converting file1: {} to mesh", stl1_filepath);
    let mut f1 = File::open(stl1_filepath).unwrap();
    let mesh1 = mesh::BinaryStlFile::read_stl(&mut f1).unwrap();

    println!("converting file2: {} to mesh", stl2_filepath);
    let mut f2 = File::open(stl2_filepath).unwrap();
    let mesh2 = mesh::BinaryStlFile::read_stl(&mut f2).unwrap();


    // generate name for file
    let mut split = stl1_filepath.split("/");
    let vec: Vec<&str> = split.collect();
    let res_path = format!("/tmp/res-{}", vec[vec.len() - 1].to_string());

    // perform operation
    println!("creating file: {}", res_path);
    let mut f_res= File::create(&res_path).unwrap();

    let result = BoolOpResult::new(&mesh1, &mesh2)
        .expect("The error was raised in a constructor of <BoolOpResult>!");

    println!("operation: {}", operation_name);
    if "union" == operation_name {
        let single_mesh_result = result.union();
        // write STL to file since geometry_kernel uses it's own Number impl
        // and it's easier to parse output file to extract Mesh of my own type

        println!("writing to file1");
        single_mesh_result.write_stl(&mut f_res);

//        binary_stl_reader::mesh_from_binary_stl_file(res_path)


    } else {
        let multi_mesh_result = match operation_name {
            "difference_ab" => result.difference_ab(),
            "difference_ba" => result.difference_ba(),
            "intersection" => result.intersection(),
            _ => result.intersection()
        };

        // write STL to file since geometry_kernel uses it's own Number impl
        // and it's easier to parse output file to extract Mesh of my own type
        println!("writing to file2");
        multi_mesh_result[0].write_stl(&mut f_res);

//        binary_stl_reader::mesh_from_binary_stl_file(res_path)
    }

    // return only filepath
    res_path
}


use geometry_kernel::bool_op::BoolOpResult;

fn valid_operation(op_name: &str) -> bool {
    "difference_ab" == op_name
    || "difference_ba" == op_name
    || "intersection" == op_name
    || "union" == op_name
}

fn create_stl_file<'a>(filepath: &'a str, content: Vec<u8>) -> File {
    let mut f = File::create(filepath.to_string()).unwrap();
    f.write_all(&content);

    File::open(filepath).unwrap()
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn test_operation_is_valid() {
        let expected = valid_operation("union");
        assert_eq!(expected, true);
    }

//    #[test]
//    #[should_panic]
//    fn test_exception_is_thrown() {
//        divide_by_zero(777);
//    }
}