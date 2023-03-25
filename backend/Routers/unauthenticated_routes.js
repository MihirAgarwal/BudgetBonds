const Router = require('express').Router();
const {serve_react_page} = require('../Components/serve_react_page');

Router.route('/signup').get(serve_react_page);


module.exports = Router;