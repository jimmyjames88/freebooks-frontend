import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach } from 'vitest';
import API from '../api';

describe('auth.ts', () => {
  let mock;

  beforeEach(() => {
    // Create a new instance of MockAdapter for each test
    mock = new MockAdapter(axios);
  });

  // Test login method
  it('login method uses the correct endpoint and receives a status of 200', async () => {
    const url = 'http://192.168.0.3:3000/auth/login'
    mock.onPost(url).reply(200, { status: 200 });

    const response = await API.auth.login('test', 'test');
    console.log('#######', response)
    expect(response.status).toBe(200);
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe(url);
    console.log('#######', mock.history.post)
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      email: 'test',
      password: 'test'
    });
  });

  // Test checkEmail method
  it('checkEmail method uses the correct endpoint and receives a status of 200', async () => {
    const url = 'http://192.168.0.3:3000/auth/check-email';
    mock.onPost(url).reply(200, { status: 200 });
  
    const response = await API.auth.checkEmail('me@james-allen.ca');
  
    expect(response.status).toBe(200);
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe(url);
    expect(JSON.parse(mock.history.post[0].data)).toEqual({ email: 'me@james-allen.ca' });
  });

  // Test register method handles successful response
  it('register method handles successful response', async () => {
    // Mock the axios POST request to return a 200 status
    const url = 'http://192.168.0.3:3000/auth/register'
    mock.onPost(url).reply(200, {
      status: 200,
      message: 'Registration successful'
    });

    const response = await API.auth.register({
      email: 'valid-email@example.com',
      password: 'validpassword',
      name: 'James Allen'
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Registration successful');
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe(url);
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      email: 'valid-email@example.com',
      password: 'validpassword',
      name: 'James Allen'
    });
  });
});