use domain::model::mesh::Mesh;
use domain::model::triangle::Triangle;
use port::adapter::model::triangle_model::TriangleModel;


#[derive(Serialize, Deserialize)]
pub struct MeshModel {
    pub len: u32,
    pub triangles: Vec<TriangleModel>
}

impl MeshModel {
    pub fn from_mesh(mesh: Mesh) -> Self {
        MeshModel::from_triangles(mesh.triangles)
    }

    pub fn from_triangles(triangles: Vec<Triangle>) -> Self {
        let models: Vec<TriangleModel> = triangles.iter()
            .map(|triangle| TriangleModel::from_triangle(*triangle))
            .collect();
        MeshModel::from_triangle_models(models)
    }

    pub fn from_triangle_models(triangle_models: Vec<TriangleModel>) -> Self {
        MeshModel{ len: triangle_models.len() as u32, triangles: triangle_models }
    }
}


pub fn mesh_stub() -> MeshModel {
    let p1 = [100.0, 100.0, 80.0];
    let p2 = [-80.0, 11.0, 100.0];
    let p3 = [60.0, -50.0, -90.0];
    let p4 = [140.0, 20.0, 100.0];

    let t1 = TriangleModel { a: p1, b: p2, c: p3, n: p4 };
    let t2 = TriangleModel { a: p2, b: p3, c: p4, n: p1 };
    let t3 = TriangleModel { a: p3, b: p4, c: p1, n: p2 };
    let t4 = TriangleModel { a: p4, b: p1, c: p2, n: p3 };

    let mut models: Vec<TriangleModel> = Vec::new();
    models.push(t1);
    models.push(t2);
    models.push(t3);
    models.push(t4);

    MeshModel::from_triangle_models(models)
}
