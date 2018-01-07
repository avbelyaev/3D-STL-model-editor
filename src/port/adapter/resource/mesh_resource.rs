use port::adapter::model::mesh_model::MeshModel;
use port::adapter::model::mesh_model::mesh_stub;
use port::adapter::command::extract_mesh_command::ExtractMeshCommand;
use port::adapter::command::perform_on_mesh_command::PerformOnMeshCommand;
use application::stl_reader::binary_stl_reader::mesh_from_binary_stl_file;

use rocket_contrib::Json;
use base64::decode;
use std::fs::File;
use std::io::prelude::*;


pub fn extract_mesh_from_stl(cmd: Json<ExtractMeshCommand>) -> Json<MeshModel> {
    let content_bytes = convert_base64_to_bytes(&cmd.stl);

    let filename = "/tmp/xtract.stl";
    let mut f = File::create(filename).unwrap();
    f.write_all(&content_bytes);

    let mesh = mesh_from_binary_stl_file(filename);

    Json(MeshModel::from_mesh(mesh))
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