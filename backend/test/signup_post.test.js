require('dotenv').config();
process.env.NODE_ENV = 'TEST';

const chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);


describe('POST /api/signup',function(){
    let status = 400;
    const port = process.env.PORT || 2700; 
    let route = `http://localhost:${port}/api/signup`;

    context('TESTS FOR VALID REQUESTS',function(){

        
        it('Should have email in request',(done)=>{
                
            let request_body = {};  

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
        
        it('email should be a string',function(done){
            let request_body = {
                "email":1,
            };
            
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
        
        it('email should have a @ and .com',function(done){
            let request_body = {
                "email":"abcd",
            };
            
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


        it('length of email username should not be 0',function(done){
            let request_body = {
                "email":"@abcd.com",
            };
            
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


        it('max length of email username is 64',function(done){
            let request_body = {
                "email":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@abcd.com",
            };
            
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


        it('There should be not < > tags',function(done){
            let request_body = {
                "email":'<script>alert("You are hacked!!")</script>@abcd.com',
            };
            
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


        it('There should be email only',function(done){
            let request_body = {
                "email":'abcd@abcd.com',
                "extra_data":"abcdefg"
            };
            
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
    
    context('INVALID EMAIL DOMAIN NAMES',function(){

        it('domain name of emails should be only gmail , hotmail , yahoo',function(done){
            let request_body = {
                "email":"rangwalahussain00@abcd.com"
            };

            chai.request(app)
            .post(route)
            .send(request_body)
            .end((err,res)=>{
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(400);
                res.body.should.have.property('message').eql('Domain Name of email is not accepted!!!');
                done();
            })
        })

    })
    
})
