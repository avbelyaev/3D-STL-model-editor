use port::adapter::point_model::PointModel;
use port::adapter::point_model::PointModelFactory;
use domain::model::triangle::Triangle;


pub struct TriangleModel {
    a: PointModel,
    b: PointModel,
    c: PointModel,
    normal: PointModel
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
            normal: PointModelFactory::from_point(triangle.normal),
        }
    }
}
