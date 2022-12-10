'use strict';

const { db, users } = require('../src/models');
const supertest = require('supertest');
const { server } = require('../src/server');
const request = supertest(server);

let testUser;

beforeAll( async () => {
  await db.sync();
  testUser = await users.create({
    username: 'test', 
    password: 'pass',
    role: 'admin',
  });
});

afterAll( async () => {
  await db.drop();
});

describe('V2 with ACL access', () => {
  it('allows writer access to post', async () => {
    let response = await request.post('/api/v2/food').set('Authorization', `Bearer ${testUser.token}`).send({
      name: 'apple',
      calories: 34,
      type: 'fruit',
    });
    expect(response.status).toBe(201);
    expect(response.body.type).toEqual('fruit');
    expect(response.body.calories).toEqual(34);
  });
  it('allows user to get one item', async () => {
    let response = await request.get('/api/v2/food/1').set('Authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body.type).toEqual('fruit');
    expect(response.body.calories).toEqual(34);
  });
  it('allows user to get all items', async () => {
    let response2 = await request.post('/api/v2/food').set('Authorization', `Bearer ${testUser.token}`).send({
      name: 'orange',
      calories: 8,
      type: 'fruit',
    });
    let response = await request.get('/api/v2/food').set('Authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body[1].name).toEqual('orange');
    expect(response.body[1].calories).toEqual(8);
    expect(response.body[1].type).toEqual('fruit');
  });

  it('allows editor to update an item', async () => {
    let response = await request.put('/api/v2/food/1').set('Authorization', `Bearer ${testUser.token}`).send({
      name: 'update',
      calories: 2,
      type: 'vegetable',
    });
    expect(response.status).toBe(200);
    expect(response.body.calories).toEqual(2);
    expect(response.body.type).toEqual('vegetable');

  });

  it('allows admin to delete an item', async () => {
    await request.delete('/api/v2/food/1').set('Authorization', `Bearer ${testUser.token}`);
    let response = await request.get('/api/v2/food/1').set('Authorization', `Bearer ${testUser.token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(null);
  });
});