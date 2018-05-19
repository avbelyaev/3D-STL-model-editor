# Hrust-Wiggle

## Rust Rocket web server

### Cargo
Rocket runs on specific Rust-nightly version of 21 dec (coincidence? I dont think so) 2017
```
rustup install nightly
rustup update
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
```


## WebGL (OpenGL ES 2.0) web client

GL-matrix lib should be [downloaded](http://glmatrix.net/), compiled and placed at `/webclient/js/lib/gl-matrix.js`

Axios should be [downloaded](https://github.com/axios/axios) and placed at `/webclient/js/lib/axios.min.js`

Logger should be [downloaded](http://www.songho.ca/misc/logger/files/Logger.js) and placed at `/webclient/js/lib/Logger.js`


## Notes
- Back to stable version of Rust: `rustup default stable`
- Lib can be omitted on Mac: `brew install gmp`
- Allow Chrome open local files on OSX
```
open /Applications/Google\ Chrome.app --args --allow-file-access-from-files
```

### Todo
- обработка ресайза в меню справа
https://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html

- переиспользовать шейдеры и программу
https://webglfundamentals.org/webgl/lessons/webgl-drawing-multiple-things.html

- поворот фигуры мб можно реализовать передав курсор прямо в шейдер и если он окажется на пикселе то применять перенос/поворот только к той фигуре на пикселе которой он окажется

- поворот лучше реализовать явным выбором фигуры в меню а сам поворот применять к некоторой выбранной фигуре

- сделать startup скрипт для скачивания gl-matrix/Logger/axios, выполнения npm install и перемещения в /js/lib

- добавить сетку (стол) как на гитхабе и отдельно зону деплоя моделей куда будут доавбляться модели по мере ответа бэкенда

- добавить в панель меню статистику о фигуре кол-во врешин, граней, объем и т.д.
