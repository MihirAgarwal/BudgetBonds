SHOW DATABASES;
CREATE DATABASE BudgetBondsTest;
USE BudgetBondsTest;


CREATE TABLE unauthentic_users(
	email VARCHAR(255) PRIMARY KEY NOT NULL,
    confirmation_code VARCHAR(255) NOT NULL,
    signup_time DATETIME NOT NULL DEFAULT now()
);

CREATE TABLE authentic_users (
	username VARCHAR(255) PRIMARY KEY NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL 
);

DELIMITER //
CREATE PROCEDURE unauthentic_user_to_authentic_user (IN user_email VARCHAR(255) , IN user_password VARCHAR(255) , IN username VARCHAR(255) )
BEGIN
DELETE FROM unauthentic_users WHERE email = user_email;
INSERT INTO authentic_users (email,user_password,username) VALUES (user_email,user_password,username);  
END
//
DELIMITER ;




SELECT now();