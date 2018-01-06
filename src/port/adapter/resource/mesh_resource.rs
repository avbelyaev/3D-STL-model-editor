use port::adapter::model::mesh_model::{MeshModel, MeshModelFactory};
use port::adapter::model::mesh_model::mesh_stub;
use port::adapter::command::extract_mesh_command::ExtractMeshCommand;
use application::binary_stl_reader::mesh_from_binary_stl;
use rocket_contrib::Json;


pub fn extract_mesh_from_stl(cmd: Json<ExtractMeshCommand>) -> Json<MeshModel> {
    let mesh = mesh_from_binary_stl(&cmd.binary_stl);

    Json(MeshModelFactory::from_mesh(mesh))
}


pub fn return_mesh_stub() -> Json<MeshModel> {
    Json(mesh_stub())
}
