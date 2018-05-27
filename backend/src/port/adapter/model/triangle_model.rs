use domain::model::triangle::Triangle;


#[derive(Serialize, Deserialize, Copy, Clone)]
pub struct TriangleModel {
    pub a: [f32; 3],
    pub b: [f32; 3],
    pub c: [f32; 3],
    pub n: [f32; 3]
}

impl TriangleModel {
    pub fn from_triangle(triangle: Triangle) -> Self {
        TriangleModel{
            a: [triangle.a.x, triangle.a.y, triangle.a.z],
            b: [triangle.b.x, triangle.b.y, triangle.b.z],
            c: [triangle.c.x, triangle.c.y, triangle.c.z],
            n: [triangle.normal.x, triangle.normal.y, triangle.normal.z],
        }
    }
}
