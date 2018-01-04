#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate geometry_server;
extern crate rocket;
extern crate rocket_contrib;

use rocket::{Rocket, Data};
use rocket_contrib::Json;
use geometry_server::port::adapter::mesh_resource;
use geometry_server::port::adapter::mesh_model::MeshModel;


#[post("/extract", format = "text/plain", data = "<stl_base64>")]
fn extract_mesh_wrapper(stl_base64: Data) -> Json<MeshModel> {
    mesh_resource::extract_mesh_from_stl(stl_base64)
}


#[get("/stub")]
fn mesh_stub_wrapper() -> Json<MeshModel> {
    mesh_resource::return_mesh_stub()
}


#[post("/create", format = "application/json", data = "<mesh_data>")]
fn create_stl_wrapper(mesh_data: Data) -> String {
    mesh_resource::create_stl_from_mesh(mesh_data)
}


fn rocket() -> Rocket {
    rocket::ignite()
        .mount("/api/mesh", routes![extract_mesh_wrapper, mesh_stub_wrapper])
        .mount("/api/stl", routes![create_stl_wrapper])
}


fn main() {
    rocket().launch();
}
