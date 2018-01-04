use port::adapter::mesh_model::{MeshModel, MeshModelFactory};
use port::adapter::point_model::PointModel;
use port::adapter::triangle_model::TriangleModel;
use rocket_contrib::Json;


pub fn extract_mesh_from_stl() -> Json<MeshModel> {
    let p1 = PointModel{ v: [0.0, 1.0, 2.5] };
    let p2 = PointModel{ v: [2.1, 3.3, 4.6] };
    let p3 = PointModel{ v: [6.36, 2.77, -1.8] };
    let p4 = PointModel{ v: [14.88, 2.2, 0.11] };

    let t1 = TriangleModel { a: p1, b: p2, c: p3, n: p4 };
    let t2 = TriangleModel { a: p4, b: p3, c: p4, n: p2 };
    let t3 = TriangleModel { a: p2, b: p3, c: p1, n: p2 };

    let mut models: Vec<TriangleModel> = Vec::new();
    models.push(t1);
    models.push(t2);
    models.push(t3);

    Json(MeshModelFactory::from_triangle_models(models))
}


pub fn create_stl_from_mesh() -> String {
    "STL from mesh".to_string()
}