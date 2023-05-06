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
    log_for VARCHAR(255) DEFAULT NULL ,
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

USE BudgetBonds;
SELECT * FROM authentic_users;
SELECT * FROM group_details;
SELECT * FROM group_requests;
SELECT * FROM group_members;
SELECT * FROM activities;
SELECT * FROM activity_expenses;
SELECT * FROM user_logs;
SELECT * FROM settles;

DROP TABLE authentic_users;
DROP TABLE group_requests;
DROP TABLE group_members;
DROP TABLE group_details;
DROP TABLE activities;
DROP TABLE activity_expenses;
DROP TABLE user_logs;
DROP TABLE settles;







INSERT INTO authentic_users (username,email,user_password) VALUES ("Shaun Phijo","shaunpanikulangara@gmail.com","$2b$10$C1a8c.ra9th57QmMGF29MO/I8OpRhOKkdNeF4wdrtr8lOO1B.pYcK") , ("Hussain Rangwala","hussain1234@gamil.com","$2b$10$4Y73DdEV5WZ16ck8C2xYn.xAgz3KrlAisF0BMf1ylc3wUWMLmTOum") , ("Keval Pambar","kevelP9822@gmail.com","$2b$10$mjC2xhLD0q3YTO.DNsXZqePgFG/A4BOmGKvppqyUoxVgSef9.q0Qa") , ("Mihir Agarwal","agarwalmihir@gmail.com","$2b$10$eluWFiF6J4j4y7zaIlabpO26SiVf5nKdjtERHhiAmAwedlcipIrYe") , ("Viren Kadam","virendevkadam@gmail.com","$2b$10$U5fqLaRGl3eku5Qnr/YjmeuAa5tX5MGBCwfuE2885Eo6L6FD0LfKu") , ("Yashraj Jarande","yashraj18jarande@gmail.com","$2b$10$L2uXRRjhjK2WA1xlJiZJMeYTRzkM0AAFiUW/y//vga6fXyzhWHn/S") , ("Shree Bohra","shreeGOATbohra@gmail.com","$2b$10$rpogSc1xXn6e4mpkh1TBu.spa20DZ.4aiQM5jsVElfQ5GomZTrS9O") , ("Alia Bhatt","aliabhattkapoor@gmail.com","$2b$10$tpAGc3gDBE4gHYVJcwlvXe6w9hGs7qypSazz8ehL1DZ4EZtHOYywO") , ("Selena Gomez","selenagomezzzz@gmail.com","$2b$10$LB6cUbv5DB3UPerzDiydR.fBLvkXMkUpp3OPis6qusuNcDYQEkIyi") , ("Vismay Joag","vismayjoagger2468@gmail.com","$2b$10$HuVuYjkXzTHNmOw4uxo5M.iRGCF5Y20.FVX2FSYSms7jPKUS3jjsq");
INSERT INTO group_details (group_name,made_by,icon) VALUES ("Always-Broke","Shaun Phijo","V") , ("thailand ","Yashraj Jarande","G");
INSERT INTO group_members (group_id,username) VALUES (1,"Shaun Phijo") , (1,"Keval Pambar") , (1,"Alia Bhatt") , (1,"Selena Gomez") , (1,"Hussain Rangwala") , (2,"Yashraj Jarande") , (2,"Shaun Phijo") , (2,"Mihir Agarwal") , (2,"Shree Bohra") , (2,"Viren Kadam");
INSERT INTO activities (group_id,activity_id,activity_name,activity_type,inserted_by,date_time,is_personal) VALUES (1,1,"Pizza","Food","Shaun Phijo","2023-05-04 23:36:53",0) , (2,2,"Petrol","Transportation","Yashraj Jarande","2023-03-03 15:45:23",0) , (2,3,"Groceries","Food","Viren Kadam","2023-03-12 09:30:00",0) , (1,4,"Books","Education","Keval Pambar","2023-03-13 09:30:00",0) , (2,5,"Printouts","Education","Mihir Agarwal","2023-03-19 09:30:00",0) , (2,6,"Curtains","Household","Shaun Phijo","2023-03-21 10:43:00",0) , (1,7,"Perfume","Other","Alia Bhatt","2023-03-23 16:20:00",0) , (null,8,"Tshirt","Apparel","Shree Bohra","2023-03-27 09:56:00",1) , (null,9,"Shoes","Apparel","Shaun Phijo","2023-03-30 09:54:00",1) , (1,10,"Rent","Household","Hussain Rangwala","2023-04-02 17:31:00",0) , (2,11,"Club Entry","Other","Yashraj Jarande","2023-04-04 21:00:00",0) , (2,12,"Rickshaw","Transportation","Viren Kadam","2023-04-04 20:29:00",0) , (1,13,"Dinner","food","Shaun Phijo","2023-04-10 19:53:00",0);
INSERT INTO activity_expenses (activity_id,username,paid,spent,income) VALUES (1,"Shaun Phijo",300,150,0) , (1,"Keval Pambar",0,150,0) , (1,"Alia Bhatt",150,150,0) , (1,"Selena Gomez",0,150,0) , (1,"Hussain Rangwala",300,150,0) , (2,"Yashraj Jarande",500,200,0) , (2,"Shaun Phijo",0,0,0) , (2,"Mihir Agarwal",100,300,0) , (2,"Shree Bohra",0,0,0) , (2,"Viren Kadam",0,100,0) , (3,"Yashraj Jarande",0,66,0) , (3,"Shaun Phijo",0,66,0) , (3,"Mihir Agarwal",330,66,0) , (3,"Shree Bohra",0,66,0) , (3,"Viren Kadam",0,66,0) , (4,"Shaun Phijo",550,325,0) , (4,"Keval Pambar",100,325,0) , (4,"Alia Bhatt",0,0,0) , (4,"Selena Gomez",0,0,0) , (4,"Hussain Rangwala",0,0,0) , (5,"Yashraj Jarande",20,13,0) , (5,"Shaun Phijo",0,13,0) , (5,"Mihir Agarwal",0,13,0) , (5,"Shree Bohra",20,13,0) , (5,"Viren Kadam",25,13,0) , (6,"Yashraj Jarande",1500,300,0) , (6,"Shaun Phijo",0,300,0) , (6,"Mihir Agarwal",0,300,0) , (6,"Shree Bohra",0,300,0) , (6,"Viren Kadam",0,300,0) , (7,"Shaun Phijo",0,0,0) , (7,"Keval Pambar",0,0,0) , (7,"Alia Bhatt",250,175,0) , (7,"Selena Gomez",100,175,0) , (7,"Hussain Rangwala",0,0,0) , (8,"Shree Bohra",800,800,0) , (9,"Shaun Phijo",9499,9499,0) , (10,"Shaun Phijo",8000,8000,0) , (10,"Keval Pambar",9000,8000,0) , (10,"Alia Bhatt",7000,8000,0) , (10,"Selena Gomez",4500,8000,0) , (10,"Hussain Rangwala",11500,8000,0) , (11,"Yashraj Jarande",0,330,0) , (11,"Shaun Phijo",0,330,0) , (11,"Mihir Agarwal",1000,330,0) , (11,"Shree Bohra",500,330,0) , (11,"Viren Kadam",150,330,0) , (12,"Yashraj Jarande",0,0,0) , (12,"Shaun Phijo",0,0,0) , (12,"Mihir Agarwal",30,40,0) , (12,"Shree Bohra",90,40,0) , (12,"Viren Kadam",0,40,0) , (13,"Shaun Phijo",1000,459,0) , (13,"Keval Pambar",1000,459,0) , (13,"Alia Bhatt",0,459,0) , (13,"Selena Gomez",295,459,0) , (13,"Hussain Rangwala",0,459,0);