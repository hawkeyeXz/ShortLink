import request from 'supertest';
import app from '../app.js';

describe('GET /', () => {
    it('should return 200 OK and a health check message', async () => {
        const res = await request(app).get('/');
        
       
        expect(res.statusCode).toBe(200);
        
        
        expect(res.text).toContain("Welcome to ShortLink."); 
    });
});