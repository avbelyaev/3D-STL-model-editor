# Hrust-Wiggle

## Rust Rocket web server

### Cargo


Rocket runs on specific Rust-nightly version
```
rustup install nightly
rustup update

# optionally fix version
rustup default nightly-2017-12-21
```


Run web server:
```
cargo run
```



### Docker

Docker requires https while pulling image.
So prior to building image add the following to docker deamon config (dockerd).
Docker config on MacOS: tray -> preferences -> daemon -> advanced

```
{
  ... other options
  "insecure-registries" : [
    "registry-1.docker.io:443"
  ]
}
```


Build and run:
```
docker build -t server .
docker run server
```


## WebGL (OpenGL ES 2.0) client

Requirements:
- GL-matrix lib should be [downloaded](http://glmatrix.net/), compiled and placed at `/webclient/js/lib/gl-matrix.js`
- Axios should be [downloaded](https://github.com/axios/axios) and placed at `/webclient/js/lib/axios.min.js`
- SASS-preprocessor should be [downloaded](http://sass-lang.com/install).
Added to PATH: `export PATH=$PATH:/path/to/dart-sass`. Usage: `sass style.scss style.css`.
Or it can be done with brew: `brew install --devel sass/sass/sass`


## Notes
- Back to stable version of Rust: `rustup default stable`
- Lib `gmp` can be omitted on Mac: `brew install gmp`
- Allow Chrome open local files on OSX
```
open /Applications/Google\ Chrome.app --args --allow-file-access-from-files
```
- Proxy may be needed to use brew: `export ALL_PROXY=https://host:port`
- Proxy for git (cargo/docker): `git config --global http.proxy http://host:port`



## Todo
- переиспользовать шейдеры и программу
https://webglfundamentals.org/webgl/lessons/webgl-drawing-multiple-things.html

- сделать startup скрипт для скачивания gl-matrix/Logger/axios, выполнения npm install и перемещения в /js/lib

- добавить в панель меню статистику о фигуре кол-во врешин, граней, объем и т.д.
