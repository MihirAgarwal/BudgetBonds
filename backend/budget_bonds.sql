SHOW DATABASES;
CREATE DATABASE BudgetBonds;
USE BudgetBonds;
SHOW TABLES IN BudgetBonds;

CREATE TABLE unauthentic_users(
	email VARCHAR(255) PRIMARY KEY NOT NULL,
    confirmation_code VARCHAR(255) NOT NULL,
    signup_time DATETIME NOT NULL DEFAULT now()
);
DROP TABLE unauthentic_users;
-- INSERT INTO unauthentic_users (email , confirmation_code) VALUES ('abc','abc');
-- INSERT INTO unauthentic_users (email,user_password,confirmation_code) VALUES ('abc','abc','bcd') ON DUPLICATE KEY UPDATE user_password='bcd',confirmation_code='cde';
SELECT * FROM unauthentic_users ;

SELECT now() ;
-- SELECT timestampdiff(SECOND,'2023-03-26 01:04:05',now()) as time_difference;
 
 CREATE TABLE authentic_users (
	username VARCHAR(255) PRIMARY KEY NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL 
 );
-- DROP TABLE authentic_users;
-- Username : abc123		Password : abcdefghijk
-- Username : abcdefghi		Password : abcdabcd
INSERT INTO authentic_users (username,email,user_password) 
VALUES('abcdefghi','rangwalahussain11@gmail.com','$2b$10$NsF8gyJvy42E7sBoq0WxWOC9.9JlIZOyH08jGHCXqufX.Y7hz7K4a');
SELECT * FROM authentic_users WHERE username='abcdefghi' ;

-- PROCEDURE TO CHANGE unauthentic_user to authentic_user
DELIMITER //
CREATE PROCEDURE unauthentic_user_to_authentic_user (IN user_email VARCHAR(255) , IN user_password VARCHAR(255) , IN username VARCHAR(255) )
BEGIN
DELETE FROM unauthentic_users WHERE email = user_email;
INSERT INTO authentic_users (email,user_password,username) VALUES (user_email,user_password,username);  
END
//
DELIMITER ;

-- TESTING PROCEDURE
SELECT * FROM authentic_users WHERE email='abc';
SELECT * FROM unauthentic_users;
INSERT INTO unauthentic_users (email,confirmation_code) VALUES ('abc','bcd');
SELECT * FROM unauthentic_users;
CALL unauthentic_user_to_authentic_user ('abc' , 'abcdefghi' , 'abcdefg');
SET SQL_SAFE_UPDATES = 0;
DELETE FROM authentic_users WHERE email='abc';
SET SQL_SAFE_UPDATES = 1;

SELECT * FROM unauthentic_users;
SELECT * FROM authentic_users;
SET SQL_SAFE_UPDATES = 0;
DELETE FROM authentic_users WHERE email = 'rangwalahussain00@gmail.com';
SET SQL_SAFE_UPDATES = 1;






-- group_details table
CREATE TABLE group_details (
group_id INTEGER AUTO_INCREMENT PRIMARY KEY, 
group_name VARCHAR(255) NOT NULL,
made_by VARCHAR(255) NOT NULL,
icon VARCHAR(255) NOT NULL,
is_deleted BOOLEAN DEFAULT false NOT NULL,

FOREIGN KEY (made_by) REFERENCES authentic_users(username),
CHECK ( icon IN ('V','I','B','G','Y','O','R') ) 
);

-- group_requests table
-- is_responded false if user does not respond to the request and true if user rejects the request 
-- and if the user accepts then the request will be deleted 
CREATE TABLE group_requests (
group_id INTEGER NOT NULL ,
username VARCHAR(255) NOT NULL ,
is_responded BOOLEAN NOT NULL DEFAULT false,

FOREIGN KEY (username) REFERENCES authentic_users(username),
FOREIGN KEY (group_id) REFERENCES group_details(group_id)
);

-- group_members table
CREATE TABLE group_members (
group_id INTEGER NOT NULL,
username VARCHAR(255) NOT NULL,
is_in_group BOOLEAN NOT NULL DEFAULT TRUE,
spent INTEGER NOT NULL DEFAULT 0,
paid INTEGER NOT NULL DEFAULT 0,

 FOREIGN KEY (group_id) REFERENCES group_details(group_id),
 FOREIGN KEY (username) REFERENCES authentic_users(username)
);


-- If the user accepts the request
DELIMITER //
CREATE PROCEDURE groupRequestAccepted(IN Username VARCHAR(255) , IN GroupID INT)
BEGIN
	DELETE FROM group_requests WHERE group_id=GroupID AND username=Username;
	INSERT INTO group_members (group_id,username,is_in_group,spent,paid) VALUES ( GroupID , Username , 1 , 0 , 0 ) ; 
END //
DELIMITER ;


-- Get group requests procedure
DELIMITER //
CREATE PROCEDURE get_group_requests( IN Username VARCHAR(255) )
BEGIN
	SELECT group_requests.group_id , group_details.group_name, group_details.icon, group_details.made_by
	FROM group_requests INNER JOIN group_details ON group_requests.group_id = group_details.group_id 
	WHERE group_requests.username = Username AND group_requests.is_accepted=0 AND group_details.is_deleted=0 ; 
END //
DELIMITER ;
CALL get_group_requests('abcdefghi');
DROP PROCEDURE get_group_requests;


-- Get groups procedure
DELIMITER //
CREATE PROCEDURE get_groups (IN Username VARCHAR(255) )
BEGIN
	-- group_id,spent,paid,group_name,icon
	SELECT group_members.group_id , group_members.spent , group_members.paid , group_details.group_name , group_details.icon 
    FROM group_members INNER JOIN group_details ON group_members.group_id = group_details.group_id 
    WHERE group_members.username = Username AND is_in_group = 1 AND group_details.is_deleted = 0;
END //
DELIMITER ;
CALL get_groups('abc123');
DROP PROCEDURE get_groups;


-- activities table
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

-- activity_expenses table
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


DELIMITER //
CREATE PROCEDURE get_activities( IN Group_id INT , IN Username VARCHAR(255) )
BEGIN
	-- activity_id , activity_name , activity_type , date_time , paid , spent 
	SELECT activities.activity_id , activities.activity_name , activities.activity_type , 
    activities.date_time , activity_expenses.paid , activity_expenses.spent 
    FROM activities INNER JOIN activity_expenses ON activities.activity_id = activity_expenses.activity_id 
    WHERE activities.group_id = Group_id AND activity_expenses.username = Username;
END // 
DELIMITER ;
CALL get_activities(1,'abc123');
DROP PROCEDURE get_activities;


-- user_logs table
CREATE TABLE user_logs (
	group_id INT NOT NULL ,
	log_by VARCHAR(255) NOT NULL ,
    log_for VARCHAR(255) ,
    date_time DATETIME DEFAULT now() ,
    user_log VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (group_id) REFERENCES group_details(group_id),
    FOREIGN KEY (log_by) REFERENCES authentic_users(username)
); 
DROP TABLE user_logs;

DELIMITER //
CREATE PROCEDURE get_group_logs(IN Group_id INT , IN Username VARCHAR(255) )
BEGIN
	SELECT log_by , log_for , date_time , user_log 
    FROM user_logs 
    WHERE (log_by = Username OR log_for = Username) AND group_id = Group_id;
END //
DELIMITER ;
CALL get_group_logs(1,'abc123');
DROP PROCEDURE get_group_logs;


CREATE TABLE settles(
	group_id INT NOT NULL,
    activity_id INT NOT NULL,
    pay_amount INT NOT NULL,
    pay_to VARCHAR(255) NOT NULL,
    pay_by VARCHAR(255) NOT NULL,
    is_settled BOOLEAN default false,
    
    FOREIGN KEY (group_id) REFERENCES group_details(group_id),
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id),
    FOREIGN KEY (pay_to) REFERENCES authentic_users(username),
    FOREIGN KEY (pay_by) REFERENCES authentic_users(username),
    CHECK(pay_amount >= 0)
);
DROP TABLE settles;


DELIMITER //
CREATE PROCEDURE get_aggregated_group_settles( IN Group_id INT , IN Username VARCHAR(255) )
BEGIN
	SELECT group_id , SUM(pay_amount) as give_amount , pay_to , pay_by
    FROM settles 
    WHERE group_id = Group_id AND settles.is_settled=0
	GROUP BY group_id , pay_by , pay_to
    HAVING ( pay_to = Username OR pay_by = Username ) AND group_id=Group_id;
END //
DELIMITER ;
CALL get_aggregated_group_settles(1,'abc123');
DROP PROCEDURE get_aggregated_group_settles;



DELIMITER //
CREATE PROCEDURE get_group_settles_of_two_members( IN Group_id INT , IN Username VARCHAR(255) , IN Username_2 VARCHAR(255) )
BEGIN
	SELECT settles.pay_amount , settles.pay_to , settles.pay_by , activities.activity_name
    FROM settles INNER JOIN activities ON settles.activity_id = activities.activity_id  
    WHERE settles.group_id = Group_id 
    AND ( ( settles.pay_to = Username AND settles.pay_by = Username_2 ) OR ( settles.pay_to = Username_2 AND settles.pay_by = Username ) ) ;
END //
DELIMITER ;
CALL get_group_settles_of_two_members( 1 , 'abc123' , 'aabb' );
DROP PROCEDURE get_group_settles_of_two_members;



SELECT * FROM group_details;
SELECT * FROM group_requests;
SELECT * FROM group_members;
SELECT * FROM activities;
SELECT * FROM activity_expenses;
SELECT * FROM user_logs;
SELECT * FROM settles;

DROP TABLE group_requests;
DROP TABLE group_members;
DROP TABLE group_details;
DROP TABLE activities;
DROP TABLE activity_expenses;
DROP TABLE user_logs;
DROP TABLE settles;