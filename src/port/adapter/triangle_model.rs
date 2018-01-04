use port::adapter::point_model::PointModel;
use port::adapter::point_model::PointModelFactory;
use domain::model::triangle::Triangle;


#[derive(Serialize, Copy, Clone)]
pub struct TriangleModel {
    pub a: PointModel,
    pub b: PointModel,
    pub c: PointModel,
    pub n: PointModel
}

pub trait TriangleModelFactory {
    fn from_triangle(triangle: Triangle) -> Self;
}

impl TriangleModelFactory for TriangleModel {
    fn from_triangle(triangle: Triangle) -> Self {
        TriangleModel{
            a: PointModelFactory::from_point(triangle.a),
            b: PointModelFactory::from_point(triangle.b),
            c: PointModelFactory::from_point(triangle.c),
            n: PointModelFactory::from_point(triangle.normal),
        }
    }
}
