use domain::model::point::Point;


#[derive(Serialize, Copy, Clone)]
pub struct Triangle {
    pub a: Point,
    pub b: Point,
    pub c: Point,
    pub normal: Point
}
