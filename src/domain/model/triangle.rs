use domain::model::point::Point;


#[derive(Copy, Clone)]
pub struct Triangle {
    pub a: Point,
    pub b: Point,
    pub c: Point,
    pub normal: Point
}
