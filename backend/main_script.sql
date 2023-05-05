SHOW DATABASES;
CREATE DATABASE BudgetBonds;
USE BudgetBonds;
SHOW TABLES IN BudgetBonds;

CREATE TABLE unauthentic_users(
	email VARCHAR(255) PRIMARY KEY NOT NULL,
    confirmation_code VARCHAR(255) NOT NULL,
    time_ms DATETIME NOT NULL DEFAULT now()
);
DROP TABLE unauthentic_users;
-- INSERT INTO unauthentic_users (email , user_password , confirmation_code) VALUES ('abc','abc','bcd');
-- INSERT INTO unauthentic_users (email,user_password,confirmation_code) VALUES ('abc','abc','bcd') ON DUPLICATE KEY UPDATE user_password='bcd',confirmation_code='cde';
SELECT * FROM unauthentic_users ;

SELECT now() ;
 -- SELECT timestampdiff(SECOND,'2023-03-26 01:04:05',now());
 
 CREATE TABLE authentic_users (
	username VARCHAR(255) PRIMARY KEY NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL 
 );
-- DROP TABLE authentic_users;
INSERT INTO authentic_users (username,email,user_password) VALUES('rangwalahussain11@gmail.com','abcdefghi','abc');