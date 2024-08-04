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
2. Setup your env for this, run `yarn setup:local`
3. Then start db server using docker container `yarn db:start`
4. Then for check postgres database working with Docker container use this command  `yarn db:connect` and check the script with your name and password for your database align with  `.env.local`
5. Then generate the types for your project using `yarn generate` 
6. Then run the project `yarn start`

## Working with Graphql Express Middleware
- https://github.com/apollographql/apollo-server#readme

## Testing
1. We use TS-JEST `https://kulshekhar.github.io/ts-jest/docs/getting-started`
2. Build env for test setup sor run `yarn setup:test`
3. Start database with docker `yarn db:start` and setup your test database as well `yarn test:database` if already exists no problem
4. Then run the app in different terminal as test server using `yarn test:server` 
5. For run test `yarn test`

in testing we use @apollo/client core for make request
** New configuration you can now run test with just up database, create a database and run test script 

## Used with
1. TypeORM
2. GraphQL
3. CodeGen
4. Redis
5. Postgres
6. Jest
7. Express
8. bcryptjs
9. yup
10. uuid
11. apollo server and client


## Lets find packages
- npx depcheck 