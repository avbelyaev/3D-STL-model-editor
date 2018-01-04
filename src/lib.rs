#![crate_name = "geometry_server"]


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


pub mod domain;
pub mod application;
pub mod port;