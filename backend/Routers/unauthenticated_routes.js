const Router = require('express').Router();
const {serve_react_page} = require('../Components/serve_react_page');
const {add_unauth_user} = require('../Components/add_unauth_user');


Router.route('/signup')
.get(serve_react_page)
.post(add_unauth_user);


module.exports = Router;