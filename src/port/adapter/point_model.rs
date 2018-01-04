use domain::model::point::Point;


pub struct PointModel {
    x: f32,
    y: f32,
    z: f32
}

pub trait PointModelFactory {
    fn from_point(point: Point) -> Self;
}

impl PointModelFactory for PointModel {
    fn from_point(point: Point) -> Self {
        PointModel{
            x: point.x,
            y: point.y,
            z: point.z,
        }
    }
}