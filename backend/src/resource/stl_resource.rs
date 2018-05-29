use port::adapter::model::mesh_model::MeshModel;
use resource::mesh_resource::convert_base64_to_bytes;
use port::adapter::command::perform_on_stl_command::PerformOnStlCommand;
use application::operation_performer::bool_op_performer::perform_on_stls;
use rocket_contrib::Json;
use rocket::Data;


pub fn create_stl_from_mesh(mesh: Data) -> String {
    "STL from mesh".to_string()
}

pub fn perform_bool_op_on_stl(cmd: Json<PerformOnStlCommand>) -> Json<MeshModel> {
    println!("Performing {} operation on STLs", cmd.operation);

//    let stl1_bytes = convert_base64_to_bytes(&cmd.stl1);
//    let stl2_bytes = convert_base64_to_bytes(&cmd.stl2);
    let output_mesh = perform_on_stls(&cmd.operation, &cmd.stl1, &cmd.stl2);

    Json(MeshModel::from_mesh(output_mesh))
}
