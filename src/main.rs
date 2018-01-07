#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate geometry_server;
extern crate rocket;
extern crate rocket_contrib;

use rocket::{Rocket, Data};
use rocket_contrib::Json;
use geometry_server::port::adapter::resource::{mesh_resource, stl_resource};
use geometry_server::port::adapter::model::mesh_model::MeshModel;
use geometry_server::port::adapter::command::{perform_on_mesh_command,
                                              perform_on_stl_command,
                                              extract_mesh_command};


// /api/mesh
#[post("/extract", format = "application/json", data = "<cmd>")]
fn extract_mesh_wrapper(cmd: Json<extract_mesh_command::ExtractMeshCommand>) -> Json<MeshModel> {
    mesh_resource::extract_mesh_from_stl(cmd)
}

#[post("/perform", format = "application/json", data = "<cmd>")]
fn mesh_performer_wrapper(cmd: Json<perform_on_mesh_command::PerformOnMeshCommand>) -> Json<MeshModel> {
    mesh_resource::perform_bool_op_on_meshes(cmd)
}

#[get("/stub")]
fn mesh_stub_wrapper() -> Json<MeshModel> {
    mesh_resource::return_mesh_stub()
}


// /api/stl
#[post("/create", format = "application/json", data = "<cmd>")]
fn create_stl_wrapper(cmd: Data) -> String {
    stl_resource::create_stl_from_mesh(cmd)
}

#[post("/perform", format = "application/json", data = "<cmd>")]
fn stl_performer_wrapper(cmd: Json<perform_on_stl_command::PerformOnStlCommand>) -> Json<MeshModel> {
    stl_resource::perform_bool_op_on_stl(cmd)
}


fn rocket() -> Rocket {
    rocket::ignite()
        .mount("/api/mesh", routes![
            extract_mesh_wrapper,
            mesh_stub_wrapper,
            mesh_performer_wrapper
        ])
        .mount("/api/stl", routes![create_stl_wrapper, stl_performer_wrapper])
}


fn main() {
    rocket().launch();
}
