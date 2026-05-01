-- Initial database setup for Rwanda Dash services
-- This file is executed automatically on container startup

-- Create additional databases for different services
CREATE DATABASE auth_service_db;
-- CREATE DATABASE order_service_db;
-- CREATE DATABASE inventory_service_db;

-- Example table creation (can be done per database if needed)
-- To create tables in a specific database, you can use:
-- \c auth_service_db;
-- CREATE TABLE IF NOT EXISTS users (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(50) UNIQUE NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     password_hash TEXT NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
