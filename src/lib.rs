#![crate_name = "geometry_server"]


extern crate regex;
extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate serde_derive;


pub mod domain;
pub mod application;
pub mod port;