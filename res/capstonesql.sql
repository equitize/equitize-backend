/*-------------*/
/* instantiate sql database*/
/*-------------*/
CREATE DATABASE capstone;
USE capstone;
CREATE TABLE startup(
    ID int NOT NULL AUTO_INCREMENT,
    company_name varchar(255) NOT NULL,
    email_address varchar(255) NOT NULL,
    company_password varchar(255) NOT NULL,
    profile_description varchar(255),
    profile_photo varchar(255),
    cap_table varchar(255),
    acra_documents varchar(255),
    pitch_deck varchar(255),
    UNIQUE(company_name),
    UNIQUE(email_address),
    PRIMARY KEY (ID)
);
CREATE TABLE retailInvestors(
    ID int NOT NULL AUTO_INCREMENT,
    email_address varchar(255) NOT NULL,
    user_password varchar(255) NOT NULL,
    first_name varchar(255),
    last_name varchar(255),
    singpass varchar(255),
    income_statement varchar(255),
    income_tax_return varchar(255),
    UNIQUE(email_address),
    PRIMARY KEY (ID)
);
CREATE TABLE campaign(
    ID int NOT NULL AUTO_INCREMENT,
    company_name varchar(255) NOT NULL,
    goal int NOT NULL,
    end_date DATE NOT NULL,
    PRIMARY KEY (ID)
);
CREATE TABLE junctionTable(
    ID int NOT NULL AUTO_INCREMENT,
    retail_investor_email varchar(255) NOT NULL,
    company_name varchar(255) NOT NULL,
    amount int NOT NULL,
    PRIMARY KEY (ID)
);
/*-------------*/
/* functions */
/*-------------*/
/* signup creation*/
INSERT INTO startup(
    company_name ,
    email_address,
    company_password ,
    profile_description ,
    profile_photo ,
    cap_table ,
    acra_documents,
    pitch_deck 
) VALUES (
    'equitize','equitize@mail.xyz','1234',NULL,NULL,NULL,NULL,NULL
);
INSERT INTO retailInvestors(
    email_address,
    user_password ,
    first_name,
    last_name,
    singpass,
    income_statement,
    income_tax_return
) VALUES(
    'dabid@projectmanager.xyz','5678',NULL,NULL,NULL,NULL,NULL
);
INSERT INTO campaign(
    company_name ,
    goal ,
    end_date 
)VALUES(
    'equitize','10000','2021-08-02'
);
INSERT INTO junctionTable(
    retail_investor_email,
    company_name ,
    amount 
)VALUES(
    'dabid@projectmanager.xyz','equitize', 1000
);
/* update details */
/* change set fields via js*/
UPDATE startup 
SET profile_description = 'equitize is an equity crowdfunding platform which uses blOckCHain.'
WHERE company_name = 'equitize';

UPDATE retailInvestors 
SET income_statement = '[LINK]'
WHERE email_address = 'dabid@projectmanager.xyz';

/* retrieve details*/
/* display profile pages */
SELECT * FROM startup WHERE company_name = 'equitize';
SELECT * FROM retailInvestors WHERE email_address = 'dabid@projectmanager.xyz';
/* display campaign page */
/* display all investors and their amount for a particular campaign*/
SELECT * FROM junctionTable WHERE company_name = 'equitize';
SELECT SUM(amount) FROM junctionTable WHERE company_name = 'equitize';
/* display all company and their amount for a particular campaign*/
SELECT * FROM junctionTable WHERE retail_investor_email = 'dabid@projectmanager.xyz';
SELECT SUM(amount) FROM junctionTable WHERE retail_investor_email = 'dabid@projectmanager.xyz';

/* delete details ----> not really sure where in the user flow this is but welps as this is CRUD */
DELETE FROM startup WHERE company_name = 'equitize';
DELETE FROM retailInvestors WHERE email_address = 'dabid@projectmanager.xyz';
