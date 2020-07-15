# GOLO Graphql backend assignment
 GOLO Graphql backend assignment for candidate Alexandre Poirier

See [this link for actual assignment](https://www.notion.so/Assignment-4ba28a125f7e4fa684a5f67f44d5fae3)

Let me first be transparent by letting you know I don't know yet how build a proper CI/CD using .yaml configuration. I do know how to manually deploy all the technologies that I'll be mentioning here and know where to find the documentation on how to build the said .yaml file to automate the build and might try to do so if I have enough time.

The backend will be done in express.js. It will run on Node.js server instance on Google App Engine. Google App Engine is a lightweight scalable solution for deploying scalable web servers. It automatically handles the creation and destruction of instance depending on the traffic and the initial app.yaml you provide. It also uses dockers under the hood apparently since version 2.

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

I would implement a restful api backend server using express.js. I think it's a rather lightweight framework and can easily serve that purpose. I have good production-environment experience with it. It integrates well with a test environment such as supertest / jest, which I intend to use.

I can use Google Cloud Platform's Tasks API for the email / SMS system. It's also another system that I have a little bit of experience in a production environment for sending emails with (I don't have experience with sending SMS though). A service such as Sengrid can help with automated notification and system email sending.

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

I will deploy the frontend on a python server as the the compiled frontend should only consist of static files and the python instance scaling is faster than Node.js' scaling from what I remember on Google App Engine.

Note: In order for the backend to respect proper conventions of a RESTFul API server, the CRUD operations will be done using the corresponding http methods (POST, GET, PUT and DELETE for example).