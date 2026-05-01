# Use the official PostgreSQL 16 image based on Alpine Linux for a small footprint
FROM postgres:16-alpine

# Environment variables (can be overridden in docker-compose.yml or at runtime)
ENV POSTGRES_DB=rwanda_dash_db
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin_password

# Copy initialization scripts to the image
# Any .sql or .sh files in this directory are executed in alphabetical order when the container starts for the first time
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432
