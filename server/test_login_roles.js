const axios = require('axios');

async function testLogins() {
    const baseURL = 'http://localhost:5000'; // Assuming server runs on 5000
    
    // Register
    try {
        await axios.post(`${baseURL}/api/auth/register`, {
            username: 'testpatient',
            email: 'patient@test.com',
            password: 'password123',
            role: 'patient'
        });
        console.log('Patient registered.');
        
        await axios.post(`${baseURL}/api/auth/register`, {
            username: 'testdoc',
            email: 'doctor@test.com',
            password: 'password123',
            role: 'psychologist'
        });
        console.log('Doctor registered.');
    } catch (e) {
        console.log('Users already exist or registration error.');
    }

    // Test Patient login as Patient
    try {
        await axios.post(`${baseURL}/api/auth/login`, {
            email: 'patient@test.com',
            password: 'password123',
            role: 'patient'
        });
        console.log('✅ Patient can log in as patient.');
    } catch (e) {
        console.error('❌ Patient failed to log in as patient.');
    }

    // Test Patient login as Doctor
    try {
        await axios.post(`${baseURL}/api/auth/login`, {
            email: 'patient@test.com',
            password: 'password123',
            role: 'psychologist'
        });
        console.error('❌ Patient was ABLE to log in as doctor! (Expected failure)');
    } catch (e) {
        console.log('✅ Patient blocked from logging in as doctor.');
    }

    // Test Doctor login as Doctor
    try {
        await axios.post(`${baseURL}/api/auth/login`, {
            email: 'doctor@test.com',
            password: 'password123',
            role: 'psychologist'
        });
        console.log('✅ Doctor can log in as doctor.');
    } catch (e) {
        console.error('❌ Doctor failed to log in as doctor.');
    }

    // Test Doctor login as Patient
    try {
        await axios.post(`${baseURL}/api/auth/login`, {
            email: 'doctor@test.com',
            password: 'password123',
            role: 'patient'
        });
        console.error('❌ Doctor was ABLE to log in as patient! (Expected failure)');
    } catch (e) {
        console.log('✅ Doctor blocked from logging in as patient.');
    }
}

testLogins();
