use domain::model::mesh::Mesh;
use port::adapter::triangle_model::TriangleModel;
use port::adapter::triangle_model::TriangleModelFactory;


pub struct MeshModel {
    pub len: i32,
    pub triangles: Vec<TriangleModel>
}

trait MeshModelFactory {
    fn from_mesh(mesh: Mesh) -> Self;
}

impl MeshModelFactory for MeshModel {
    fn from_mesh(mesh: Mesh) -> Self {
        let mut models: Vec<TriangleModel> = mesh.triangles.iter()
            .map(|triangle| TriangleModelFactory::from_triangle(*triangle))
            .collect();
        let models_amount = models.len() as i32;

        MeshModel{ len: models_amount, triangles: models }
    }
}