const chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);


describe('POST /api/signup',function(){
    let status = 400;
    let route = '/api/signup';

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
        
        
        it('Should have password in request',function(done){
            let request_body = {
                "email":1
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
        
        
        it('email should be a string',function(done){
            let request_body = {
                "email":1,
                "password":1
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
        
        
        it('password should be a string',function(done){
            let request_body = {
                "email":"abcd",
                "password":1
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
                "password":"abcd"
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
                "password":"abcdefghijkl"
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
                "password":"abcdefghijkl"
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
                "password":"abcdefghijkl"
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


        it('There should be email and password only',function(done){
            let request_body = {
                "email":'abcd@abcd.com',
                "password":"abcdefghijkl",
                "extra_data":"anything else"
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
    
    
    context('PASSWORD AND EMAIL LENGTHS ERROR',function(){
        
        it('password should have a min length of 8',function(done){
            let request_body = {
                "email":"abcdegh@abcd.com",
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
                "email":"abcdegh@abcd.com",
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


    context('INVALID EMAIL DOMAIN NAMES',function(){

        it('domain name of emails should be only gmail , hotmail , yahoo',function(done){
            let request_body = {
                "email":"rangwalahussain00@abcd.com",
                "password":"abcdefghijkl"
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
