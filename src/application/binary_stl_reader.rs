use domain::model::mesh::Mesh;
use domain::model::triangle::Triangle;
use domain::model::point::Point;
use regex::Regex;


pub fn read_binary_stl(s: &str) -> Mesh {

    let p = normal_point(s);

    let mut v: Vec<Triangle> = Vec::new();
    v.push(Triangle{ a: p, b: p, c: p, normal: p });
    v.push(Triangle{ a: p, b: p, c: p, normal: p });

    Mesh{ triangles: v }
}


fn normal_point<'a>(facet_normal_str: &'a str) -> Point {

    let re = Regex::new(r"\s+").unwrap();
    let split: Vec<f32> = re.split(facet_normal_str)
        .filter(|s| is_number(s))
        .map(|num| num.parse::<f32>().unwrap())
        .collect();

    Point{ x: split[0], y: split[1], z: split[2] }
}


fn is_number(s: &str) -> bool {
    let num = s.parse::<f32>();
    match num {
        Ok(val) => true,
        Err(why) => false,
    }
}