# How to run Backend code

1. Change values of /database/db.ts with your own db credentials
2. Create table for restaurants
CREATE TABLE restaurants(
id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
email VARCHAR(50) NOT NULL,
photo VARCHAR NOT NULL,
uniqueid VARCHAR(36) NOT NULL,
description VARCHAR NOT NULL,
RATING INTEGER NOT NULL DEFAULT 0,
tags VARCHAR NOT NULL,
branch INTEGER NOT NULL,
phone VARCHAR NOT NULL,
location VARCHAR;
); 
3. Create another table for user
CREATE TABLE costumers(
id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL,
email VARCHAR(50) NOT NULL,
photo VARCHAR NOT NULL,
uniqueid VARCHAR(36) NOT NULL,
admin boolean DEFAULT false);
4. npm run dev

# How to create admin account
1. set value of admin to true
UPDATE costumers SET admin = true WHERE email = 'youremail@gmail.com';
