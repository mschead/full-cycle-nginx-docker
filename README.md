# Full Cycle - NGINX Reverse Proxy with Node.js and MySQL

This project uses NGINX as a reverse proxy to a Node.js application that inserts a name into MySQL and returns:

```
<h1>Full Cycle Rocks!</h1>
```

followed by the list of names stored in the database.

## Stack

- NGINX (reverse proxy)
- Node.js (Express)
- MySQL 8
- Docker Compose

## Run

```bash
docker-compose up -d
```

Then open `http://localhost:8080`.

Each request will:

- Ensure the `people` table exists
- Insert a new random name into `people`
- Render the header and a list of all names

## Project Structure

- `docker-compose.yml`: services for `nginx`, `app`, and `db`
- `nginx/`: reverse proxy config
- `app/`: Node.js application
- `db/init.sql`: initializes database and table on first run

## Notes

- NGINX listens on port 80 inside the container and is published on host port 8080.
- The Node app listens on port 3000 and is only exposed to the Docker network.
- MySQL credentials and DB name are set via environment variables in `docker-compose.yml`.

## Cleanup

```bash
docker-compose down -v
```

This stops containers and removes the DB volume.
