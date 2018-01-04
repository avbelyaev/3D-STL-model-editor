//#![feature(plugin)]
//#![plugin(rocket_codegen)]
//
//extern crate regex;
//extern crate rocket;
//extern crate rocket_contrib;
//extern crate serde;
//
//#[macro_use]
//extern crate serde_derive;
//
//use std::fs::File;
//use std::io::prelude::*;
//use regex::Regex;
//use rocket_contrib::Json;
//
//
//fn f() {
//
//    let filename = "cube.stl";
//    let mut f = File::open(filename)
//        .expect("file was not found");
//
//    let mut contents_as_str = String::new();
//    f.read_to_string(&mut contents_as_str)
//        .expect("shitstorm");
//
//    let p = normal_point("facet normal  0.0   0.0  -1.5");
//    println!("{}", p.z)
//}
//
//

#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate geometry_server;
extern crate rocket;
extern crate rocket_contrib;

use rocket::Rocket;
//extern crate serde;
//
//#[macro_use]
//extern crate serde_derive;
//
//use rocket_contrib::Json;

use geometry_server::port::adapter::mesh_resource;


#[get("/extract")]
fn extract_mesh_wrapper() -> String {
    mesh_resource::extract_mesh_from_stl()
}

#[get("/create")]
fn create_stl_wrapper() -> String {
    mesh_resource::create_stl_from_mesh()
}


fn rocket() -> Rocket {
    let rocket = rocket::ignite()
        .mount("/api/mesh", routes![extract_mesh_wrapper])
        .mount("/api/stl", routes![create_stl_wrapper]);
    rocket
}

fn main() {
    rocket().launch();
//    let p = geometry_server::domain::model::point::Point{x : 0.5, y: 0.0, z: 0.0};
//    let t = geometry_server::domain::model::triangle::Triangle{ a: p, b: p, c: p, normal: p };
//    println!("{}" , p.x);
//
//    let m = geometry_server::port::adapter::create_mesh_resource::create_mesh_resource("asa");
//    println!("{}", m);
}
