use domain::model::point::Point;


const TRIANGLE_POINTS_NUM: i32 = 12;

#[derive(Copy, Clone)]
pub struct Triangle {
    pub a: Point,
    pub b: Point,
    pub c: Point,
    pub normal: Point
}

impl Triangle {
    pub fn from_normal_and_points(v: &Vec<f32>) -> Self {
        if TRIANGLE_POINTS_NUM != v.len() as i32 {
            panic!("Wrong number of points provided!")
        }
        let n = Point::from_slice(&v[0..3]);
        let a = Point::from_slice(&v[3..6]);
        let b = Point::from_slice(&v[6..9]);
        let c = Point::from_slice(&v[9..12]);

        Triangle { a, b, c, normal: n }
    }
}
