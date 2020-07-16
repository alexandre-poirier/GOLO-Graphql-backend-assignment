# GOLO Graphql backend assignment
 GOLO Graphql backend assignment for candidate Alexandre Poirier

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
        * a checkbox to enable email notifications
        * a checkbox to enable sms notifications

I will deploy the frontend on a python server as the the compiled frontend should only consist of static files and the python instance scaling is faster than Node.js' scaling from what I remember on Google App Engine.

Note: 

1. In order for the backend to respect proper conventions of a RESTFul API server, the CRUD operations will be done using the corresponding http methods (POST, GET, PUT and DELETE for example).
2. The sub portion of the payload in the JWT will be used as the ID of the resident or admin asking for a resource. The JWT will always check the provided privateKey and the ID in the ActiveSession table to validate the access to an endpoint (except for the login endpoint which creates a jwt).
3. It's taking me longer than expected to do the implementation. Here is how I would go about to finish the backend:
* For the rest of the backend, I would finish implementing the user/login endpoint. 
* For the system to function properly, I added a constraint where the emails should be unique in the system. 
* I would add jest and supertest to start doing endpoint integration tests and unit tests. 
* I would create a GET endpoint on /building/:buildingId that retrieves all the units of the building (I would make sure that the session is an admin session). 
* I would created a DELETE /user/logout that reads the jwt token and sets the is_active value to false (deleting records is slow and the session table would be accessed very often, I would rather use a scheduled task that deletes all rows with is_active set to false every x hours for example). 
* I would create a GET /user/packagestatus/:userEmail to retrieve the package delivery status of a user
* I would create a POST /user/ that creates user by checking the body for proper values such as email and password. This endpoint needs to be accessed by a security admin. I would assume that in v1 of the product, the admins would be added manually to the database. Also POST /building, POST /building/packageunit with proper requirements in the body of the request.
* I would create a PUT /user/notifications/:sms&:email that updates the notifications settings for a user
* I would create the DELETE endpoints for /building/:buildingAddress, /user/:email, /building/packageunit/:buildingAddress&:packageUnit
4. The notification task api is a script deployed separately that's called after every X time. It would check all residents who have enabled notifications in the database and send them the proper type of notification and finally set the proper smsNotificationSent of emailNotificationSent to 1 to avoid sending again for that user.

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