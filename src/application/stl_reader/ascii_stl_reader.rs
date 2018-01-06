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
