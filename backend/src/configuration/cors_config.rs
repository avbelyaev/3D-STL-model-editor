use rocket::{Request, Response};
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{Header, ContentType, Method};
use std::io::Cursor;

pub struct CORS();

//https://github.com/SergioBenitez/Rocket/issues/25
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Adds CORS headers to responses",
            kind: Kind::Response
        }
    }

    fn on_response(&self, request: &Request, response: &mut Response) {
        if request.method() == Method::Options || response.content_type() == Some(ContentType::JSON) {
            response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
            response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, OPTIONS"));
            response.set_header(Header::new("Access-Control-Allow-Headers", "Content-Type, Accept"));
//            response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
        }

        if request.method() == Method::Options {
            response.set_header(ContentType::Plain);
            response.set_sized_body(Cursor::new(""));

            if 404 == response.status().code {
                print!("editing response status of probably failed preflight request");
                response.set_raw_status(200, "OK");
            }
        }
    }
}