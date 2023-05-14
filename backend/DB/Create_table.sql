SHOW DATABASES;
CREATE DATABASE BudgetBonds;
USE BudgetBonds;
SHOW TABLES IN BudgetBonds;

-- unauthentic_users
CREATE TABLE unauthentic_users(
	email VARCHAR(255) PRIMARY KEY NOT NULL,
    confirmation_code VARCHAR(255) NOT NULL,
    signup_time DATETIME NOT NULL DEFAULT now()
);

-- authentic_users
 CREATE TABLE authentic_users (
	username VARCHAR(255) PRIMARY KEY NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL 
 );
 
 
 -- group_details
 CREATE TABLE group_details (
group_id INTEGER AUTO_INCREMENT PRIMARY KEY, 
group_name VARCHAR(255) NOT NULL,
made_by VARCHAR(255) NOT NULL,
icon VARCHAR(255) NOT NULL,
is_deleted BOOLEAN DEFAULT false NOT NULL,

FOREIGN KEY (made_by) REFERENCES authentic_users(username),
CHECK ( icon IN ('V','I','B','G','Y','O','R') ) 
);


-- group_requests
CREATE TABLE group_requests (
group_id INTEGER NOT NULL ,
username VARCHAR(255) NOT NULL ,
is_responded BOOLEAN NOT NULL DEFAULT false,

FOREIGN KEY (username) REFERENCES authentic_users(username),
FOREIGN KEY (group_id) REFERENCES group_details(group_id)
);



-- group_members
CREATE TABLE group_members (
group_id INTEGER NOT NULL,
username VARCHAR(255) NOT NULL,
is_in_group BOOLEAN NOT NULL DEFAULT TRUE,
spent INTEGER NOT NULL DEFAULT 0,
paid INTEGER NOT NULL DEFAULT 0,

 FOREIGN KEY (group_id) REFERENCES group_details(group_id),
 FOREIGN KEY (username) REFERENCES authentic_users(username)
);





CREATE TABLE activities ( 
group_id INTEGER DEFAULT NULL , 
activity_id INTEGER AUTO_INCREMENT PRIMARY KEY , 
activity_name VARCHAR(255) NOT NULL ,
activity_type VARCHAR(25) NOT NULL , 
inserted_by VARCHAR(255) NOT NULL ,
date_time DATETIME DEFAULT now() ,
is_personal BOOLEAN NOT NULL ,

CHECK ( activity_type IN ('Food' , 'Household' , 'Apparel' , 'Education' , 'Transportation' , 'Other' ) ) ,
FOREIGN KEY (inserted_by) REFERENCES authentic_users(username),
FOREIGN KEY (group_id) REFERENCES group_details(group_id)
) ;




CREATE TABLE activity_expenses (
activity_id INTEGER NOT NULL,
username VARCHAR(255) NOT NULL,
paid INTEGER DEFAULT 0,
spent Integer DEFAULT 0,
income Integer DEFAULT 0,

CHECK(paid >= 0),
CHECK(spent >=0 ),
CHECK(income >= 0),
FOREIGN KEY (activity_id) REFERENCES activities(activity_id),
FOREIGN KEY (username) REFERENCES authentic_users(username)
);






CREATE TABLE user_logs (
	group_id INT NOT NULL ,
	log_by VARCHAR(255) NOT NULL ,
    log_for VARCHAR(255) DEFAULT NULL ,
    date_time DATETIME DEFAULT now() ,
    user_log VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (group_id) REFERENCES group_details(group_id),
    FOREIGN KEY (log_by) REFERENCES authentic_users(username)
);





CREATE TABLE to_settle(
	group_id INT NOT NULL,
    pay_amount INT NOT NULL DEFAULT 0,
    user1 VARCHAR(255) NOT NULL,
    user2 VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (group_id) REFERENCES group_details(group_id),
    FOREIGN KEY (user1) REFERENCES authentic_users(username),
    FOREIGN KEY (user2) REFERENCES authentic_users(username)
);
-- user1 takes from user2 => user2 has to take then pay_amount negative
--                        => user2 has to give then pay_amount positive






CREATE TABLE settled(

	group_id INT NOT NULL,
    pay_amount INT NOT NULL,
    sender VARCHAR(255) NOT NULL,
    reciever VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (group_id) REFERENCES group_details(group_id),
    FOREIGN KEY (sender) REFERENCES authentic_users(username),
    FOREIGN KEY (reciever) REFERENCES authentic_users(username)

);


