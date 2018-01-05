const POINT_COUNT: i32 = 3;


#[derive(Copy, Clone)]
pub struct Point {
    pub x: f32,
    pub y: f32,
    pub z: f32
}

pub trait PointFactory {
    fn from_slice(points: &[f32]) -> Self;
}

impl PointFactory for Point {
    fn from_slice(points: &[f32]) -> Self {
        if POINT_COUNT != points.len() as i32 {
            panic!("Cannot compose Point from slice not of size 3")
        }
        Point {
            x: points[0],
            y: points[1],
            z: points[2],
        }
    }
}