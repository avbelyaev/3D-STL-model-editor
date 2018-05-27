#![crate_name = "geometry_server"]


extern crate base64;
extern crate byteorder;
extern crate geometry_kernel;
extern crate regex;

#[macro_use] extern crate log;
extern crate env_logger;

extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate serde_derive;
extern crate stl;


pub mod domain;
pub mod application;
pub mod port;
pub mod resource;
pub mod configuration;
