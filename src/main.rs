#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate regex;
extern crate rocket;
extern crate rocket_contrib;
extern crate serde;

#[macro_use]
extern crate serde_derive;

use std::fs::File;
use std::io::prelude::*;
use regex::Regex;
use rocket_contrib::Json;


struct Point {
    x: f32,
    y: f32,
    z: f32
}


struct Triangle {
    a: Point,
    b: Point,
    c: Point,
    normal: Point
}


fn is_number(s: &str) -> bool {
    let num = s.parse::<f32>();
    match num {
        Ok(val) => true,
        Err(why) => false,
    }
}


fn normal_point<'a>(facet_normal_str: &'a str) -> Point {

    let re = Regex::new(r"\s+").unwrap();
    let split: Vec<f32> = re.split(facet_normal_str)
        .filter(|s| is_number(s))
        .map(|num| num.parse::<f32>().unwrap())
        .collect();

    Point{ x: split[0], y: split[1], z: split[2] }
}


fn read_stl<'a, 'b>(filename: &'a str, path: &'a str) -> &'a str {
    return "asdsa";
}

fn f() {

    let filename = "cube.stl";
    let mut f = File::open(filename)
        .expect("file was not found");

    let mut contents_as_str = String::new();
    f.read_to_string(&mut contents_as_str)
        .expect("shitstorm");

    let vec: Vec<&str> = contents_as_str.split("\n").collect();

    let s = "a";
    println!("{}", read_stl(&s, &"asd"));

    let p = normal_point("facet normal  0.0   0.0  -1.5");
    println!("{}", p.z)
}


#[derive(Serialize)]
struct Task {
    x: i32
}

#[get("/")]
fn index<'a>() -> Json<Task> {
    Json(Task{ x: 1337 })
}

fn main() {
    rocket::ignite().mount("/api", routes![index]).launch();
}
