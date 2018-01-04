#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate geometry_server;
extern crate rocket;
extern crate rocket_contrib;

use rocket::Rocket;
use rocket_contrib::Json;
use geometry_server::port::adapter::mesh_resource;
use geometry_server::port::adapter::mesh_model::MeshModel;


#[get("/extract")]
fn extract_mesh_wrapper() -> Json<MeshModel> {
    mesh_resource::extract_mesh_from_stl()
}


#[get("/create")]
fn create_stl_wrapper() -> String {
    mesh_resource::create_stl_from_mesh()
}


fn rocket() -> Rocket {
    rocket::ignite()
        .mount("/api/mesh", routes![extract_mesh_wrapper])
        .mount("/api/stl", routes![create_stl_wrapper])
}


fn main() {
    rocket().launch();
}
