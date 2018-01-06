use port::adapter::model::mesh_model::MeshModel;
use port::adapter::model::mesh_model::mesh_stub;
use port::adapter::command::extract_mesh_command::ExtractMeshCommand;
use port::adapter::command::perform_on_mesh_command::PerformOnMeshCommand;
use application::stl_reader::binary_stl_reader::mesh_from_binary_stl;
use rocket_contrib::Json;


pub fn extract_mesh_from_stl(cmd: Json<ExtractMeshCommand>) -> Json<MeshModel> {
    let mesh = mesh_from_binary_stl(&cmd.binary_stl);

    Json(MeshModel::from_mesh(mesh))
}


pub fn perform_bool_op_on_mesh(cmd: Json<PerformOnMeshCommand>) -> Json<MeshModel> {
    println!("performing {} on meshes", cmd.operation);

    Json(mesh_stub())
}


pub fn return_mesh_stub() -> Json<MeshModel> {
    Json(mesh_stub())
}
