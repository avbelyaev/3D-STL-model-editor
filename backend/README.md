# Backend (Rocket)

Cargo build & run:
```
cargo build

export ROCKET_ENV=production|development
cargo run
```

Docker build & run:
```
build -t rocket .
docker run rocket
```

### Notes

- Dev mode rocket listens to localhost:port
- Prod mode rocket listens to 0.0.0.0:port since its supposed to run inside container