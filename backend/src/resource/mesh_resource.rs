use port::adapter::model::mesh_model::MeshModel;
use port::adapter::model::mesh_arrayable_model::MeshArrayableModel;
use port::adapter::model::mesh_model::mesh_stub;
use port::adapter::command::extract_mesh_command::ExtractMeshCommand;
use port::adapter::command::perform_on_mesh_command::PerformOnMeshCommand;

use rocket_contrib::Json;
use base64::decode;
use std::fs::File;
use std::io::prelude::*;
use stl;


pub fn extract_mesh_from_stl(cmd: Json<ExtractMeshCommand>) -> Json<MeshArrayableModel> {
    let content_bytes = convert_base64_to_bytes(&cmd.stl);

    // save to tmp file for log purposes
    let filename = "/tmp/xtract.stl";
    let mut tmp_file = File::create(filename).unwrap();
    tmp_file.write_all(&content_bytes);

    // open saved file
    let mut stl_file = File::open(filename).unwrap();
    let stl_parsed = stl::read_stl(&mut stl_file).unwrap();

    Json(MeshArrayableModel::from_binary_stl_file(&stl_parsed))
}


pub fn perform_bool_op_on_meshes(cmd: Json<PerformOnMeshCommand>) -> Json<MeshModel> {
    println!("performing {} on meshes", cmd.operation);

    Json(mesh_stub())
}


pub fn return_mesh_stub() -> Json<MeshModel> {
    Json(mesh_stub())
}


pub fn convert_base64_to_bytes(string: &str) -> Vec<u8> {
    decode(string).unwrap()
}