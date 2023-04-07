const Router = require('express').Router();

const {serve_react_page} = require('../Components/serve_react_page');
const {signup_post} = require('../Components/signup_post');
const {login_post} = require('../Components/login_post');
const {refresh_token_post} = require('../Components/refresh_token_post');
const {user_credentials_get} = require('../Components/user_credentials_get');
const {user_credentials_post} = require('../Components/user_credentials_post');

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



module.exports = Router;