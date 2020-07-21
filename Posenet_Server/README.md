# Instruction to run

## Setup
 Pull this branch onto your local machine

```bash
git pull origin development:'your local branch name'
```
Install nginx and update the nginx.conf with the one present in this branch at the location below

```bash
/usr/local/etc/nginx or /etc/nginx 
```

Go the the root directory and mentioned below and place the files there. Make sure there is no other index file present

```bash
/usr/local/var/www
```

## Running and Testing

To start the server, run 
```bash
nginx
```
Open the browser and type

```html
localhost:8080/
```
