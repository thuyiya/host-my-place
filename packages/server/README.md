# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command


1. env setup
2. run postgres under docker container
3. config tslint
4. apollo server `yarn add @apollo/server @graphql-tools/schema graphql graphql-subscriptions graphql-ws ws`
5. setup nodemon
6. for auto generate graphql `yarn add -D @graphql-codegen/cli @graphql-codegen/typescript-resolvers @graphql-codegen/typescript` so lets add GraphQL Code Generator (graphql-code-generator or graphql-codegen)
7. to import .graphql files `@graphql-tools/load-files`

## For Typescript compile issue
- Please make sure you are using same version in vs code as in your project

## Connect to Postgres in Docker using your machine terminal
1. First find your container name `docker ps`
2. `docker exec -it <container_id_or_name> psql -U ${DB_USERNAME} -d ${DB_NAME}`

## use `bcryptjs` for authentication

## Start Project

first of all clone the project and `yarn` for install `node_modules`

1. First install Docker on your machine and run Docker first
2. Then start db server using docker container `yarn db:start`
3. Then for check postgres database working with Docker container use this command  `yarn db:connect` and check the script with your name and password for your database align with  `.env.local`
4. Then generate the types for your project using `yarn generate` 
5. Then run the project `yarn start`