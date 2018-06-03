# Nginx

Nginx commands:
```
# start (if theres an error, try sudo)
nginx

# reload conf
nginx -s reload

# stop
nginx -s stop
```


Docker build & run:
```
docker build -t jinx .
docker run jinx
```


### Notes

- If launched inside container, `host` from `proxy_pass http://<host>:5000;` 
defines a service name (rocket/goproxy/...), which is not localhost

- Generate certs (since HTTP/2 requires TLS)
```
openssl req -x509 -nodes \
    -days 365 \
    -newkey rsa:2048 \
    -keyout cert.key \
    -out cert.crt
```

- Nginx conf path on macOS (brew): `/usr/local/etc/nginx`


### FAQ

Error:
```
nginx: [alert] could not open error log file: open() "/usr/local/var/log/nginx/error.log" failed (13: Permission denied)
```

Solve:
```
sudo chmod -R 766 /usr/local/var/log/nginx
```

