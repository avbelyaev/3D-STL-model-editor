#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate geometry_server;
extern crate rocket;
extern crate rocket_contrib;

use rocket::{Rocket, Data};
use rocket_contrib::Json;
use geometry_server::port::adapter::mesh_resource;
use geometry_server::port::adapter::mesh_model::MeshModel;
use geometry_server::port::adapter::command::perform_command::PerformCommand;
use geometry_server::port::adapter::command::extract_mesh_command::ExtractMeshCommand;


#[post("/extract", format = "application/json", data = "<cmd>")]
fn extract_mesh_wrapper(cmd: Json<ExtractMeshCommand>) -> Json<MeshModel> {
    mesh_resource::extract_mesh_from_stl(cmd)
}

#[get("/stub")]
fn mesh_stub_wrapper() -> Json<MeshModel> {
    mesh_resource::return_mesh_stub()
}


#[post("/create", format = "application/json", data = "<cmd>")]
fn create_stl_wrapper(cmd: Data) -> String {
    mesh_resource::create_stl_from_mesh(cmd)
}

#[post("/perform", format = "application/json", data = "<cmd>")]
fn bool_op_wrapper(cmd: Json<PerformCommand>) -> Json<MeshModel> {
    mesh_resource::perform_bool_operation(cmd)
}


fn rocket() -> Rocket {
    rocket::ignite()
        .mount("/api/mesh", routes![extract_mesh_wrapper, mesh_stub_wrapper])
        .mount("/api/stl", routes![create_stl_wrapper, bool_op_wrapper])
}


fn main() {
    rocket().launch();
}
