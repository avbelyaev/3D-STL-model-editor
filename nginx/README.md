# Nginx

### Commands

```
# start
nginx

# reload conf
nginx -s reload

# stop
nginx -s stop
```


### Notes

Generate certs
```
openssl req -x509 -nodes \
    -days 365 \
    -newkey rsa:2048 \
    -keyout cert.key \
    -out cert.crt
```

---

Nginx conf path on macOS (brew): `/usr/local/etc/nginx`

---

Error:
```
nginx: [alert] could not open error log file: open() "/usr/local/var/log/nginx/error.log" failed (13: Permission denied)
```

Solve:
```
sudo chmod -R 766 /usr/local/var/log/nginx
```

---

