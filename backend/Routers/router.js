const Router = require('express').Router();

const {serve_react_page} = require('../Components/serve_react_page');
const {signup_post} = require('../Components/signup_post');
const {login_post} = require('../Components/login_post');
const {refresh_token_post} = require('../Components/refresh_token_post');
const {user_credentials_get} = require('../Components/user_credentials_get');
const {user_credentials_post} = require('../Components/user_credentials_post');
const {personal_expense_post} = require('../Components/personal_expense_post');
const {personal_expense_get} = require('../Components/personal_expense_get');
const { check_access_token } = require('../middlewares/check_access_token');
const { groups_post } = require('../Components/groups_post');
const { groups_get } = require('../Components/groups_get');
const { group_request_post } = require('../Components/group_request_post');
const { group_request_get } = require('../Components/group_request_get');
const { group_members_get } = require('../Components/group_members_get');
const { activities_get } = require('../Components/activities_get');
const { activities_post } = require('../Components/activities_post');
const { logs_get } = require('../Components/logs_get');
const { settles_get } = require('../Components/settles_get');
const { settles_post } = require('../Components/settles_post');

// UNAUTHENTICATED ROUTES

Router.route('/signup')
.get(serve_react_page)
.post(signup_post);

Router.route('/user_credentials')
.get(user_credentials_get)
.post(user_credentials_post);

Router.route('/refresh_token')
.post(refresh_token_post);

Router.route('/login')
.post(login_post);



// AUTHENTICATED ROUTES

// for adding personal expense POST=> ADD NEW EXPENSE   GET=> RETERIVE EXPENSE BOTH GROUPS AND PERSONAL
Router.route('/personal_expense')
.post(check_access_token,personal_expense_post)
.get(check_access_token,personal_expense_get);

// for creating groups      POST=> CREATE NEW GROUP     GET=> RETERIVE ALREADY CREATED GROUPS  
Router.route('/groups')
.post(check_access_token,groups_post)
.get(check_access_token,groups_get);

// For group requests   POST=> ACCEPT OR REJECT REQUEST     GET=> RETRIEVE GROUP REQUESTS 
Router.route('/group_request')
.post(check_access_token,group_request_post)
.get(check_access_token,group_request_get);

// group members GET=>RETRIEVE GROUP MEMBERS DATA 
Router.route('/groups/:group_id/members')
.get(check_access_token,group_members_get);

// activities
Router.route('/groups/:group_id/activities')
.get(check_access_token,activities_get)
.post(check_access_token,activities_post);

// logs
Router.route('/groups/:group_id/logs')
.get(check_access_token,logs_get);

// settles
Router.route('/groups/:group_id/settles')
.get(check_access_token,settles_get)
.post(check_access_token,settles_post);

module.exports = Router;