require('dotenv').config();
process.env.NODE_ENV = 'TEST';

const chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let pool = require('../DB/db');

chai.use(chaiHttp);


describe('POST /api/login',function(){

    const port = process.env.PORT || 2800;
    const route = `https://localhost:${port}/api/login`;

    context('INVALID REQUESTS',function(){

        it('Should have username',function(done)
        {
            let request_body = {}

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Invalid Request!!!');
                done();
            })
        })
        
        it('Should have password',function(done){
            let request_body = {username:1}

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Invalid Request!!!');
                done();
            })
        })

        it('Username should be a string',function(done){
            let request_body = {username:1,password:123}

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Invalid Request!!!');
                done();
            })
        })

        it('Password should be a string',function(done){
            let request_body = {username:"abcd",password:123}

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Invalid Request!!!');
                done();
            })
        })

        it('Request should only have a username and password',function(done){
            let request_body = {username:"abcd",password:"123",id:5}

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Invalid Request!!!');
                done();
            })
        })
        
        it('username or password should not have < or >',function(done){
            let request_body = {username:"ab<>cd",password:"123456789"}

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Invalid Request!!!');
                done();
            })
        })

    })

    context('Password length incorrect',function(){

        it('password should have a min length of 8',function(done){
            let request_body = {
                "username":"abcdefg",
                "password":"abcd"
            };

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Length of password should not be less than 8!!');
                done();
            })
        })
        
        
        it('password should have a max length of 16',function(done){
            let request_body = {
                "username":"abcdefg",
                "password":"abcdabcdabcdabcdabcd"
            };

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Length of password should not be greater than 16!!');
                done();
            })
        })
    })


    context('Length of username',function(){

        it('Username should have minimum length 2',function(done){
            let request_body = {
                "username":"a",
                "password":"abcd"
            };

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Length of username should not be less than 2!!!');
                done()
            })
        })
        
        it('Username should have maximum length 20',function(done){
            let request_body = {
                "username":"abcdabcdabcdabcdabcdabcd",
                "password":"abcd"
            };

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Username cannot have length greater than 20!!!');
                done();
            })
        })


    })

})