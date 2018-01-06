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
            .map(|triangle| TriangleModelFactory::from_triangle(*triangle))
            .collect();
        MeshModel::from_triangle_models(models)
    }

    pub fn from_triangle_models(triangle_models: Vec<TriangleModel>) -> Self {
        MeshModel{ len: triangle_models.len() as u32, triangles: triangle_models }
    }
}


pub fn mesh_stub() -> MeshModel {
    let p1 = [0.0, 1.0, 2.5];
    let p2 = [2.1, 3.3, 4.6];
    let p3 = [6.36, 2.77, -1.8];
    let p4 = [14.88, 2.2, 0.11];

    let t1 = TriangleModel { a: p1, b: p2, c: p3, n: p4 };
    let t2 = TriangleModel { a: p4, b: p3, c: p4, n: p2 };
    let t3 = TriangleModel { a: p2, b: p3, c: p1, n: p2 };

    let mut models: Vec<TriangleModel> = Vec::new();
    models.push(t1);
    models.push(t2);
    models.push(t3);

    MeshModel::from_triangle_models(models)
}
