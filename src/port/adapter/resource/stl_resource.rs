use port::adapter::model::mesh_model::MeshModel;
use port::adapter::model::mesh_model::mesh_stub;
use port::adapter::command::perform_command::PerformCommand;
use rocket_contrib::Json;
use rocket::Data;


pub fn create_stl_from_mesh(mesh: Data) -> String {
    "STL from mesh".to_string()
}


pub fn perform_bool_operation(cmd: Json<PerformCommand>) -> Json<MeshModel> {
    println!("{}", cmd.operation);
    Json(mesh_stub())
}
