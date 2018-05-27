use port::adapter::model::mesh_model::MeshModel;


#[derive(Deserialize)]
pub struct PerformOnMeshCommand {
    pub mesh1: MeshModel,
    pub mesh2: MeshModel,
    pub operation: String
}
