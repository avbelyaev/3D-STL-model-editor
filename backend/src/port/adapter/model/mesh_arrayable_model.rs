use domain::model::mesh::Mesh;
use domain::model::triangle::Triangle;
use port::adapter::model::triangle_model::TriangleModel;
use stl;


#[derive(Serialize, Deserialize)]
pub struct MeshArrayableModel {
    pub vertices: Vec<f32>,
    pub normals: Vec<f32>
}

impl MeshArrayableModel {
    pub fn from_binary_stl_file(binary_stl: &stl::BinaryStlFile) -> Self {
        let triangle_num = binary_stl.triangles.len();
        println!("creating mesh(vertices, normals) model of {} triangles", triangle_num);

        let mut vertices = Vec::new();
        let mut normals = Vec::new();
        for t in binary_stl.triangles.iter() {
            vertices.extend_from_slice(&t.v1);
            vertices.extend_from_slice(&t.v2);
            vertices.extend_from_slice(&t.v3);
            normals.extend_from_slice(&t.normal);
        }

        MeshArrayableModel { vertices, normals }
    }
}
