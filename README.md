# Setup
--- 
Install MySQL https://dev.mysql.com/downloads/mysql/ 

Install MySQL WorkBench https://www.mysql.com/products/workbench/

Use MySQL WorkBench to connect to MySQL locally.

Create a database named testdb

Update PASSWORD field in ~/db/config/db.config.js

# QuickStart
---
Use `yarn install` to install all dependencies.

Use `yarn clean` to remove all retailInvestor API logs.
* Run this before push to github.

Use `yarn dev` for connections to local mySQL and CloudStorage (development bucket).
* This script will drop all db tables and resync upon code change

Use `yarn dev-persistent` for connections to local mySQL and CloudStorage (development bucket).
* This script will persist existing db tables, update tables with new model definitions (if any) and resync upon code change

Use `yarn prod` for connections to cloudSQL and CloudStorage (production bucket).

Notes: For now, we will develop using local MySQL with CloudStorage Integration. 

# Summary
---
Equitize-backend is the backend API server that integrates various 3rd party services such as zilliqa's blockchain network, auth0's authorisation/authentication services and google cloud platform's cloud services. We adjusted from the popular MVC framework to produce a variant called the Model-Controller-Service Layers for our use case. 


# CronJobs 
---
Smart Contract Deployments
* Checks for SC Deployment Ellgibility every 5s. (Development Mode)


# Testing
---
Use `yarn test` to run pre-configured Jest tests.
