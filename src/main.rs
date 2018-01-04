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
//#[derive(Serialize, Copy, Clone)]
//struct Point {
//    x: f32,
//    y: f32,
//    z: f32
//}
//
//
//#[derive(Serialize, Copy, Clone)]
//struct Triangle {
//    a: Point,
//    b: Point,
//    c: Point,
//    normal: Point
//}
//
//
//fn is_number(s: &str) -> bool {
//    let num = s.parse::<f32>();
//    match num {
//        Ok(val) => true,
//        Err(why) => false,
//    }
//}
//
//
//fn normal_point<'a>(facet_normal_str: &'a str) -> Point {
//
//    let re = Regex::new(r"\s+").unwrap();
//    let split: Vec<f32> = re.split(facet_normal_str)
//        .filter(|s| is_number(s))
//        .map(|num| num.parse::<f32>().unwrap())
//        .collect();
//
//    Point{ x: split[0], y: split[1], z: split[2] }
//}
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
//#[get("/")]
//fn index() -> Json<Vec<Triangle>> {
//    let p = normal_point("0.0   0.0  -1.5");
//    let t = Triangle{ a: p, b: p, c: p, normal: p };
//    let vec = vec![t, t];
//    Json(vec)
//}

extern crate geometry_server;
//
//#[get("/")]
//fn index() -> String {
//    "asdsa"
//}


fn main() {
//    rocket::ignite()
//        .mount("/api", routes![index])
//        .launch();
    let p = geometry_server::domain::model::point::Point{x : 0.5, y: 0.0, z: 0.0};
    let t = geometry_server::domain::model::triangle::Triangle{ a: p, b: p, c: p, normal: p };
    println!("{}" , p.x);

    let m = geometry_server::port::adapter::create_mesh_resource::create_mesh_resource();
    println!("{}", m.x);
}
