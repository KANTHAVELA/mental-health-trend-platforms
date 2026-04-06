const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-analytics';

async function verifyRBAC() {
    try {
        console.log('--- Starting RBAC Verification ---');

        // Setup: Ensure we have a patient and a provider
        await mongoose.connect(MONGO_URI);

        // 1. Setup Patient (kaleeswaran)
        await User.updateOne(
            { email: 'kaleeswaran.ad23@bitsathy.ac.in' },
            { $set: { role: 'patient' } }
        );

        // 2. Setup Provider (DemoUser)
        await User.updateOne(
            { email: 'demo@example.com' },
            { $set: { role: 'psychologist' } }
        );

        console.log('Roles updated in DB.');

        // 3. Login as Patient
        console.log('\n--- Testing Patient Access ---');
        try {
            const patientLogin = await axios.post(`${API_URL}/auth/login`, {
                email: 'kaleeswaran.ad23@bitsathy.ac.in',
                password: 'password123'
            });
            const patientToken = patientLogin.data.token;
            console.log('Patient logged in. Token role:', patientLogin.data.role);

            // Access Patient Route
            await axios.get(`${API_URL}/patient/me`, {
                headers: { Authorization: `Bearer ${patientToken}` }
            });
            console.log('✅ Patient accessed patient route: SUCCESS');

            // Try Protected Provider Route
            try {
                await axios.get(`${API_URL}/provider/dashboard-analytics`, {
                    headers: { Authorization: `Bearer ${patientToken}` }
                });
                console.error('❌ Patient accessed provider route: FAILED (Should be forbidden)');
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    console.log('✅ Patient denied provider route: SUCCESS (403 Forbidden)');
                } else {
                    console.error('❌ Unexpected error for patient->provider:', err.message);
                }
            }

        } catch (err) {
            console.error('Patient login/test failed:', err.message);
        }

        // 4. Login as Provider
        console.log('\n--- Testing Provider Access ---');
        try {
            const providerLogin = await axios.post(`${API_URL}/auth/login`, {
                email: 'demo@example.com',
                password: 'hashedpassword123'
            });
            const providerToken = providerLogin.data.token;
            console.log('Provider logged in. Token role:', providerLogin.data.role);

            // Access Provider Route
            await axios.get(`${API_URL}/provider/dashboard-analytics`, {
                headers: { Authorization: `Bearer ${providerToken}` }
            });
            console.log('✅ Provider accessed provider route: SUCCESS');

        } catch (err) {
            console.error('Provider login/test failed:', err.message);
        }

        mongoose.disconnect();

    } catch (error) {
        console.error('Verification Error:', error);
    }
}

verifyRBAC();
