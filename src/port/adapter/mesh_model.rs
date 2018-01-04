use domain::model::mesh::Mesh;
use domain::model::triangle::Triangle;
use port::adapter::triangle_model::TriangleModel;
use port::adapter::triangle_model::TriangleModelFactory;


#[derive(Serialize)]
pub struct MeshModel {
    pub len: u32,
    pub triangles: Vec<TriangleModel>
}

pub trait MeshModelFactory {
    fn from_mesh(mesh: Mesh) -> Self;

    fn from_triangles(triangles: Vec<Triangle>) -> Self;

    fn from_triangle_models(triangle_models: Vec<TriangleModel>) -> Self;
}

impl MeshModelFactory for MeshModel {
    fn from_mesh(mesh: Mesh) -> Self {
        MeshModelFactory::from_triangles(mesh.triangles)
    }

    fn from_triangles(triangles: Vec<Triangle>) -> Self {
        let models: Vec<TriangleModel> = triangles.iter()
            .map(|triangle| TriangleModelFactory::from_triangle(*triangle))
            .collect();
        MeshModelFactory::from_triangle_models(models)
    }

    fn from_triangle_models(triangle_models: Vec<TriangleModel>) -> Self {
        MeshModel{ len: triangle_models.len() as u32, triangles: triangle_models }
    }
}