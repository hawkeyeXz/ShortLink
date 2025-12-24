import request from 'supertest';
import app from '../app.js';

describe('GET /', () => {
    it('should return 200 OK and the frontend page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    // Check for the title of your new HTML page instead
    expect(res.text).toContain("ShortLink | Professional URL Shortener"); 
});
});