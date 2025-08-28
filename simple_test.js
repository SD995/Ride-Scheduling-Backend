#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000';

async function testRegistration() {
    console.log('Testing user registration...');
    
    const timestamp = Date.now();
    const testData = {
        name: `Test User ${timestamp}`,
        email: `testuser${timestamp}@example.com`,
        password: 'password123',
        employeeId: `EMP${timestamp}`,
        department: 'Engineering',
        phoneNumber: '+1234567890'
    };
    
    console.log('Sending data:', JSON.stringify(testData, null, 2));
    
    try {
        const response = await fetch(`${BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        const data = await response.json();
        
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('✅ Registration successful!');
        } else {
            console.log('❌ Registration failed!');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testRegistration(); 