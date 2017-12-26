#[macro_use]
extern crate glium;

use glium::*;

fn main() {
//    use glium::DisplayBuild;
    let display = glium::glutin::WindowBuilder::new()
        .with_dimensions(1024,1024)
        .with_title("rustafari")
        .build_glium()
        .unwrap();
}


