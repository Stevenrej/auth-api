'use strict';

process.env.SECRET = 'TEST_SECRET';

const { db } = require('../src/models');
const supertest = require('supertest');
const { server } = require('../src/server');
const request = supertest(server);

let userData = {
  testUser: { username: 'user', password: 'password' },
};



beforeAll( async () => {
  await db.sync();
});

afterAll( async () => {
  await db.drop();
});
describe('authorization', () => {
  it('sign up route works', async () => {
    let response = await request.post('/signup').send(userData.testUser);
    let userObj = response.body;

    expect(response.status).toBe(201);
    expect(userObj.token).toBeDefined();
    expect(userObj.user.id).toBeDefined();
    expect(userObj.user.username).toEqual(userData.testUser.username);
  });

  it('sign in route works', async () => {
    let { username, password } = userData.testUser;
    let response = await request.post('/signin').auth(username, password);
    let userObj = response.body;

    expect(response.status).toBe(200);
    expect(userObj.token).toBeDefined();
    expect(userObj.user.id).toBeDefined();
    expect(userObj.user.username).toEqual(username);
  });
});