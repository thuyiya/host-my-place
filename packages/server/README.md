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