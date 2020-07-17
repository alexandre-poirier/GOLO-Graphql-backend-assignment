# GOLO Graphql backend assignment
 GOLO Graphql backend assignment for candidate Alexandre Poirier

Let me first be transparent by letting you know I don't know yet how build a proper CI/CD using .yaml configuration. I do know how to manually deploy all the technologies that I'll be mentioning here and know where to find the documentation on how to build the said .yaml file to automate the build and might try to do so if I have enough time.

I will be building the backend using [graphql-yoga](https://github.com/prisma-labs/graphql-yoga). It's built on top of the lightweight express backend server, apollo-server and graphql-js and it should make the creation of the backend much easier.

Prisma 2 will be used as a client that translate our GraphQL requests to our MySQL database. I will also generate the schema of the database by using prisma's generate cli tool. I will use Nexus' [SDL Converter tool](https://nexus.js.org/converter) to convert the simple graphql into its corresponding Nexus' typescript code. 

Note that as the project would evolves, the schema would be updated by calling makeSchema from Nexus on the updated corresponding Nexus typed functions. 

I will use supertest / jest / mocha to test the backend.

It will run on Node.js server instance on Google App Engine. Google App Engine is a lightweight scalable solution for deploying scalable web servers. It automatically handles the creation and destruction of instance depending on the traffic and the initial app.yaml you provide. It also uses dockers under the hood apparently since version 2.

A service such as Sengrid can help with automated notification and system email sending.

I'll start first by extracting what I understand would be the different components I need to implement to cover the requirements. I'll give which technology I chose to cover those features:

Points 1. and 2. give an idea of the schema required in the database. I will use CloudSQL to implement the relational database. It is a fast ACID-compliant relational RDBMS compliant with MySQL 5.7 syntax and can handle up to 4000 simultaneous connections and you can change the tier of the machine simply by rebooting it.

Here are the domain models that comes to my mind when reading the required backend features:

* Resident
    * Address
    * UnitNumber
    * Email
    * Password (hashed)
    * Name
    * PhoneNumber
    * IsSmsNotification
    * IsEmailNotification
    * (foreign key one to many) PackageUnit

* PackageUnit
    * Code
    * PackageIsDelivered

* Building
    * Address
    * (foreign key one to many) PackageUnit

* SecurityAdmin
    * Email
    * Password (hashed)


I have to say I didn't know about GraphQL until I read about it during this technical test and as I understand it, it is some sort of general object-relational mapping framework that uses a graph structure to fetch data from various types of database systems. I think the combination of this framework should be easy with an authentication system using jwt as the tokens from jwt contain the rights claims and maybe I could create a mapping of resource retrieval that's compatible without too much changes in the structure (from the jwt to the GraphQL request). 

Finally, I will create a front-end application separated from the backend app using react that will have
* A login page for reception / security administrator
    * Asks for:
        * Email
        * Password
* A welcome page with access to building form page, resident login page
* Building form page: A form to fetch units for a building with fields
    * Unit number
    * Resident name

* resident login page: 
    * Asks for:
        * Email
        * Password
    * Displays:
        * packages with delivery status
        * a checkbox to enable email notifications
        * a checkbox to enable sms notifications

The frontend will be built with react + apollographql (a frontend client for GraphQL). I will use pre-existing components from react-bootstrap as it should let me build a frontend quickly with multi-browser and multi-layout considerations already implemented.

I will deploy the frontend on a python server as the the compiled frontend should only consist of static files and the python instance scaling is faster than Node.js' scaling from what I remember on Google App Engine.

Note: 

1. The sub portion of the payload in the JWT will be used as the ID of the resident or admin asking for a resource. The JWT will always check the provided privateKey and the ID in the ActiveSession table to validate the access to an endpoint (except for the login endpoint which creates a jwt).
2. It's taking me longer than expected to do the implementation. Here is how I would go about to finish the backend:
* For the system to function properly, I added a constraint where the emails should be unique in the system. 
* See additional notes section below
3. The notification system would use [bull](https://github.com/OptimalBits/bull). As such once an package is marked as delivered, a task could be sent into a bull queue and the resident would receive a notification if it was enabled (sms and/or email).

## Notes on linting
I installed installed ESLint VS Code extension that enables formatting of JavaScript code. For reference, I'm mostly following [this guide](https://www.robinwieruch.de/prettier-eslint). 

I will use the default linting conventions from the extension called Prettier.

        npm install prettier eslint

I will eslint-config-prettier and eslint-plugin-prettier in the project in order for ESLint to use Prettier's formsatting.

        npm install --save-dev eslint-config-prettier eslint-plugin-prettier        

I will add the following settings in a file called .eslintrc.json which is read by ESLint to configure it and tell it to use prettier properly:

        {
            "extends": ["prettier"],
            "plugins": ["prettier"],
            "rules": {
                "prettier/prettier": ["error"]
            }
        }

I can now use formatting on JavaScript files and have the formatting rules follow Prettier standard configuration. An alert window could warn you that you're about to use a local installation of eslint if you also have a global installation of eslint in your work environment. Just click allow.

## Notes on the endpoints of the backend

The GraphQL programming paradigm involves something different from a standard REST backend. I will be creating the following POST endoints that will enable the client to retrieve, modify, create or delete resources on the same endpoint by respecting the GraphQL schema definition (if it has the required rights of course):

POST /building
POST /user
POST /package
POST /login

## Notes on authentication and authorization

I will be using express-jwt for the authentication + authorization of the backend. The login endpoint will allow the creation of jwt token and will not be protected. It will create a session with an id, a private key (the shared secret), a field indicating if the session is still active and a field to check if it's an admin session. 

The jwt token will be created only if comparing the hash of the email + password is the same hash as the one in the database. 

I will be using aes256 as a hashing method as it's a rather secure encryption standard.