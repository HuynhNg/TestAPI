import request from 'supertest';
import { expect } from 'chai';

const baseUrl = '127.0.0.1:3000';
let TokenReset;
const TokenExpried= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6Imh1eW5oYmJiQGdtYWlsLmNvbSIsImlhdCI6MTcyNDI0MjA3MywiZXhwIjoxNzI0MzI4NDczfQ.nHoUVQkP22V0VzPEydjUrSgV1dMRe_68OPcd6GIbwgo";
let LoginToken;
let LoginTokenExpired="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOjIsImlhdCI6MTcyMTgxMDcyMiwiZXhwIjoxNzIxODk3MTIyfQ.j_unWJMpKBOHbpD7t6qk2GEzXUnfHaX02u9T5SpSkoU";
const PollID =9;
//test register
describe('Register',()=>{
    it('Register successful',(done)=>{
        const user ={
            Email: 'huynh@gmail.com',
            Name: 'huynh',
            Password: '123'
        };
        request(baseUrl)
            .post('/Auth/Register')
            .send(user)
            .expect(201)
            .end((err, res)=>{
                if (err) return done(err);
                expect(res.body).to.have.property('message').eql('Created User');
                done();
            })
    })
    it('Name empty',(done)=>{
        const user = {
            Email: 'huynh@gmail.com',
            Password: '123'
        }
        request(baseUrl)
            .post('/Auth/Register')
            .send(user)
            .expect(400)
            .end((err, res)=>{
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Name is not empty');
                done();
            })
    })

    it('Email empty',(done)=>{
        const user = {
            Name: 'huynh',
            Password: '123'
        }
        request(baseUrl)
            .post('/Auth/Register')
            .send(user)
            .expect(400)
            .end((err, res)=>{
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Email is not empty');
                done();
            })
    })
    it('Email is not valid',(done)=>{
        const user ={
            Email: 'huynh',
            Name: 'huynh',
            Password: '123'
        };
        request(baseUrl)
            .post('/Auth/Register')
            .send(user)
            .expect(400)
            .end((err, res)=>{
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Email is not valid');
                done();
            })
    })
    it('Password empty',(done)=>{
        const user = {
            Email: 'huynh@gmail.com',
            Name: 'huynh',
        }
        request(baseUrl)
            .post('/Auth/Register')
            .send(user)
            .expect(400)
            .end((err, res)=>{
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Password is not empty');
                done();
            })
    })

    it('User already exit',(done)=>{
        const user = {
            Email: 'huynhbbb963@gmail.com',
            Name: 'Huynh',
            Password: '123'
        }
        request(baseUrl)
            .post('/Auth/Register')
            .send(user)
            .expect(409)
            .end((err, res)=>{
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('User already exist');
                done();
            })
    })
})


//Test Login
describe('Login API', () => {
    it('Login successful', (done) => {
        const user = {
            Email: 'huynhbbb963@gmail.com',
            Password: '123'
        };

        request(baseUrl)
            .post('/Auth/Login')
            .send(user)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('token');
                LoginToken=res.body.token;
                done();
            });
    });
    it('User not found', (done) => {
        const user = {
            Email: 'huynhbbb9634@gmail.com',
            Password: 'abc'
        };

        request(baseUrl)
            .post('/Auth/Login')
            .send(user)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('User not found');
                done();
            });
    });
    it('incorrect password', (done) => {
        const user = {
            Email: 'huynhbbb963@gmail.com',
            Password: 'abc'
        };

        request(baseUrl)
            .post('/Auth/Login')
            .send(user)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Invalid password');
                done();
            });
    });
});

// Test ForgetPass

describe('ForgetPassword',()=>{
    //dùng arrow function
    // it('Successful', function(done) {
    //     this.timeout(5000); 
    //     const user = {
    //         Email: 'huynhbbb963@gmail.com',
    //     };
    //     request(baseUrl)
    //         .post('/Auth/ForgetPassword')
    //         .send(user)
    //         .expect(200)
    //         .end((err, res) => {
    //             if (err) return done(err);
    //             expect(res.body).to.have.property('token');
    //             done();
    //         });
    // });

    //dùng callback function
    it('Successful', function(done) {
        const user = {
            Email: 'huynhbbb963@gmail.com',
        };
        request(baseUrl)
            .post('/Auth/ForgetPassword')
            .send(user)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.error(res.body);
                    return done(err);
                }
                expect(res.body).to.have.property('token');
                TokenReset=res.body.token;
                // console.log(TokenReset);
                done();
            });
    }).timeout(5000);
    it('Email is empty', (done) => {
        const user = {
        };
        request(baseUrl)
            .post('/Auth/ForgetPassword')
            .send(user)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Email is not empty');
                done();
            });
    });
    it('Email is empty', (done) => {
        const user = {
            Email: 'huynhbbb9634@gmail.com',
        };
        request(baseUrl)
            .post('/Auth/ForgetPassword')
            .send(user)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('User not found');
                done();
            });
    });
})

// ResetPassword
describe('ResetPassword',()=>{
    it('Successful', (done) => {
        const user = {
            Password: "123"
        };
        request(baseUrl)
            .post('/Auth/ResetPassword')
            .set('Authorization', `Bearer ${TokenReset}`)
            .send(user)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').eql('Reset oke');
                done();
            });
    });
    it('Token not found', (done) => {
        const user = {
            Password: "123"
        };
        request(baseUrl)
            .post('/Auth/ResetPassword')
            .send(user)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Token not found');
                done();
            });
    });
    it('Token has expired', (done) => {
        const user = {
            Password: "123"
        };
        request(baseUrl)
            .post('/Auth/ResetPassword')
            .set('Authorization', `Bearer ${TokenExpried}`)
            .send(user)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Token has expired');
                done();
            });
    });
})


//Poll
describe('Create Poll',()=>{
    it('Created successfull',(done)=>{
        const poll = {
            "Title": "Test Poll",
        };
        request(baseUrl)
            .post('/User/Poll/Create')
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(poll)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').eql('Create pool successfull');
                done();
            });
    })
    it('Token not found', (done) => {
        const poll = {
            "Title": "Test Poll",
        };
        request(baseUrl)
            .post('/User/Poll/Create')
            .send(poll)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Token not found');
                done();
            });
    });
    it('Token has expired', (done) => {
        const poll = {
            "Title": "Test Poll",
        };
        request(baseUrl)
            .post('/User/Poll/Create')
            .set('Authorization', `Bearer ${LoginTokenExpired}`)
            .send(poll)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Token has expired');
                done();
            });
    });
})

describe('Update Poll', () => {
    it('Update Successful', (done) => {
        const poll = {
            "PollID": "9",
            "Title": "Test"
        };
        request(baseUrl)
            .post('/User/Poll/Update')
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(poll)
            .expect(200)
            .end((err, res) => {
                if (err) 
                {
                    console.log(res.body.error);
                    return done(err);
                }
                expect(res.body).to.have.property('message').eql('Update successful');
                done();
            });
    });

    it('Token not found', (done) => {
        const poll = {
            "PollID": "9",
            "Title": "Test"
        };
        request(baseUrl)
            .post('/User/Poll/Update')
            .send(poll)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Token not found');
                done();
            });
    });

    it('Token has expired', (done) => {
        const poll = {
            "PollID": "9",
            "Title": "Test"
        };
        request(baseUrl)
            .post('/User/Poll/Update')
            .set('Authorization', `Bearer ${LoginTokenExpired}`)
            .send(poll)
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Token has expired');
                done();
            });
    });

    it('PollID is not empty', (done) => {
        const poll = {
            "Title": "Test"
        };
        request(baseUrl)
            .post('/User/Poll/Update')
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(poll)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('PollID is not empty');
                done();
            });
    });

    it('Poll not found', (done) => {
        const poll = {
            "PollID": "1",
            "Title": "Test"
        };
        request(baseUrl)
            .post('/User/Poll/Update')
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(poll)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Poll not found');
                done();
            });
    });

    it('Cannot update this poll', (done) => { 
        const poll = {
            "PollID": "22",
            "Title": "Test"
        };
        request(baseUrl)
            .post('/User/Poll/Update') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(poll)
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('You cant update this poll');
                done();
            });
    });
});
describe('Get Poll',()=>{
    it('get all poll by UserID',(done)=>{
        request(baseUrl)
            .get('/User/Poll') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('Polls').that.is.an('array');
                expect(res.body.Polls.length).to.be.greaterThan(0);
                done();
            });
    })
    it('get Poll by PollID',(done)=>{
        request(baseUrl)
            .get(`/User/Poll/${PollID}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('Polls').that.is.an('object');
                const poll = res.body.Polls;
                expect(poll).to.have.property('PollID').eql(PollID);
                done();
            });
    })
})

//Option
describe('Get Options', () => {
    it('get options by PollID', (done) => {

        request(baseUrl)
            .get(`/User/Option?PollID=${PollID}`) 
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('Options').that.is.an('array');

                res.body.Options.forEach(option => {
                    expect(option).to.have.property('PollID').eql(PollID);
                });

                done();
            });
    });
    it('get options by pollID bot found',(done)=>{
        request(baseUrl)
            .get(`/User/Option?PollID=1`) 
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Poll not found');
                done();
            });
    })
});
describe('Create Option', () => {
    it('Create successfully', (done) => {
        const option = {
            "PollID": "9",
            "Content": "Test111"
        };
    
        request(baseUrl)
            .post('/User/Option/Create') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(option)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err); 
                expect(res.body).to.have.property('message').eql('Create Option successful'); 
                done(); 
            });
    });

    it('Create option already exists', (done) => {
        const option = {
            "PollID": "9",
            "Content": "Check"
        };

        request(baseUrl)
            .post('/User/Option/Create') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(option)
            .expect(409)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('This option already exists');
                done();
            });
    });

    it('Poll not found', (done) => {
        const option = {
            "PollID": "1",
            "Content": "Check"
        };

        request(baseUrl)
            .post('/User/Option/Create') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(option)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error').eql('Poll not found');
                done();
            });
    });
});

//Vote
describe('Create Vote',()=>{
    it('Vote successfully', (done) => {
        const option = {
            "OptionID": "3"
        };
    
        request(baseUrl)
            .post('/User/Vote') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(option)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err); 
                expect(res.body).to.have.property('message').eql('Vote successfully'); 
                done(); 
            });
    });
    it('Vote already exist', (done) => {
        const option = {
            "OptionID": "1"
        };
    
        request(baseUrl)
            .post('/User/Vote') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(option)
            .expect(409)
            .end((err, res) => {
                if (err) return done(err); 
                expect(res.body).to.have.property('error').eql('Vote already exist'); 
                done(); 
            });
    });
    it('Option not found', (done) => {
        const option = {
            "OptionID": "100"
        };
    
        request(baseUrl)
            .post('/User/Vote') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(option)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err); 
                expect(res.body).to.have.property('error').eql('Option not found'); 
                done(); 
            });
    });
})

describe('Delete Vote',()=>{
    it('Delete Vote successfully', (done) => {
        const option = {
            "OptionID": "3"
        };
    
        request(baseUrl)
            .delete('/User/Vote') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(option)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err); 
                expect(res.body).to.have.property('message').eql('Delete vote successfully'); 
                done(); 
            });
    });
    it('Vote not found', (done) => {
        const option = {
            "OptionID": "2"
        };
    
        request(baseUrl)
            .delete('/User/Vote') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(option)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err); 
                expect(res.body).to.have.property('error').eql('Vote not found'); 
                done(); 
            });
    });
    it('Option not found', (done) => {
        const option = {
            "OptionID": "100"
        };
    
        request(baseUrl)
            .delete('/User/Vote') 
            .set('Authorization', `Bearer ${LoginToken}`)
            .send(option)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err); 
                expect(res.body).to.have.property('error').eql('Option not found'); 
                done(); 
            });
    });
})
