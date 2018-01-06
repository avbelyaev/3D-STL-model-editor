use domain::model::point::Point;


#[derive(Serialize, Copy, Clone)]
pub struct PointModel {
    pub v: [f32; 3]
}

pub trait PointModelFactory {
    fn from_point(point: Point) -> Self;
}

impl PointModelFactory for PointModel {
    fn from_point(point: Point) -> Self {
        PointModel{ v: [point.x, point.y, point.z] }
    }
}