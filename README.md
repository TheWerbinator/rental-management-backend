# Rental Management - A React Project
## Overview
This is the backend for TheWerbinator's Senior React project 'Rental Management'.

The application is a barebones representation of a match-making service, much like Uber or AirBnb, that connects users wishing to rent heavy equipment with an inventory of equipment available to rent.

## Dependencies
This project is made to work in two parts - a frontend and a backend.

This repository is the backend.
The backend lives at https://github.com/TheWerbinator/rental-management

In addition to the frontend, this project is also dependent on a number of packages that can be installed through Node Package Manager (NPM) by installing NPM and running the command 'npm i' in a terminal.

Lastly, this project uses a JSON Web Token (JWT) to encode information travelling between the fronend and the backend. You will need a .env file with the following environment variables -

DATABASE_URL - a string as the URL for your database, whether that be a file location or a hosted IP address. This project is set up using Prisma as the ORM, so ```file:./dev.db``` is likely appropriate.

JWT_SECRET - a string of your choosing used as the secret for the encoding. 
