import 'dotenv/config';
import app from '../app.js';
import request from 'supertest';
import { describe, it, expect } from 'vitest';

//Creating a new user
describe('Create User', () => {
    const userData = {
        username: 'Example Username',
        email: 'email@example.com',
        password: '123456',
        location: 'Gainesville, Florida',
      };

    it('User should be created and should return 200 OK', async () => {
      const response = await request(app)
        .post('/api/user/post')
        .send(userData); 
      expect(response.statusCode).toBe(200);
    });
});

//Unit test to test that we can get all the data about a user
describe('Get Data about User', () => {
    it('Gets all user data and should return 200 OK', async () => {
        const response = await request(app)
            .get('/api/user/getAllData/email@example.com');
        expect(response.statusCode).toBe(200);

        const userData = response.body;
        expect(userData.username).toBe('Example Username');
        expect(userData.location).toBe('Gainesville, Florida');
    });
});

//Unit test to test that we can get location from user email
describe('Get user Location', () => {
    it('Gets user location and should return 200 OK', async () => {
        const response = await request(app)
            .get('/api/user/getLocation/email@example.com');
        expect(response.statusCode).toBe(200);

        const userData = response.body;
        expect(userData.location).toBe('Gainesville, Florida');
    });
});

//Unit test to test that we can update location for a specific user
describe('Updating user location', () => {
    it('Gets user location and should return 200 OK', async () => {
        const response = await request(app)
            .patch('/api/user/updateLocation/email@example.com/Jacksonville');
        expect(response.statusCode).toBe(200);
    });
});