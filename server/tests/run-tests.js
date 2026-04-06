const assert = require('node:assert/strict');

const MoodEntry = require('../models/MoodEntry');
const { app } = require('../server');
const {
    calculateDailyTrends,
    calculateCategoryDistribution,
} = require('../utils/calculateTrends');

async function runHealthAndAuthTests(baseUrl) {
    console.log('1. Checking health endpoint');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthPayload = await healthResponse.json();
    assert.equal(healthResponse.status, 200);
    assert.equal(healthPayload.status, 'ok');

    console.log('2. Validating auth input rules');
    const invalidRegisterResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'ab',
            email: 'wrong',
            password: '123',
        }),
    });
    const invalidRegisterPayload = await invalidRegisterResponse.json();
    assert.equal(invalidRegisterResponse.status, 400);
    assert.ok(invalidRegisterPayload.message);

    console.log('3. Registering and logging in a patient');
    const uniqueId = Date.now();
    const email = `patient_${uniqueId}@test.com`;

    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: `patient_${uniqueId}`,
            email,
            password: 'password123',
            role: 'patient',
        }),
    });
    const registerPayload = await registerResponse.json();
    assert.equal(registerResponse.status, 201);
    assert.equal(registerPayload.role, 'patient');

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password: 'password123',
            role: 'patient',
        }),
    });
    const loginPayload = await loginResponse.json();
    assert.equal(loginResponse.status, 200);
    assert.ok(loginPayload.token);

    console.log('4. Verifying RBAC protections');
    const patientAreaResponse = await fetch(`${baseUrl}/api/patient/me`, {
        headers: {
            Authorization: `Bearer ${loginPayload.token}`,
        },
    });
    assert.equal(patientAreaResponse.status, 200);

    const providerAreaResponse = await fetch(`${baseUrl}/api/provider/dashboard-analytics`, {
        headers: {
            Authorization: `Bearer ${loginPayload.token}`,
        },
    });
    assert.equal(providerAreaResponse.status, 403);

    const roleMismatchResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password: 'password123',
            role: 'psychologist',
        }),
    });
    assert.equal(roleMismatchResponse.status, 401);
}

async function runTrendUtilityTests() {
    console.log('5. Validating trend aggregation helpers');
    const originalAggregate = MoodEntry.aggregate;

    try {
        MoodEntry.aggregate = async () => ([
            {
                _id: '2026-04-01',
                averageMood: 6,
                keywords: [['calm', 'sleep'], ['calm']],
                count: 2,
            },
            {
                _id: '2026-04-02',
                averageMood: 4.5,
                keywords: [['stress'], ['stress', 'focus']],
                count: 2,
            },
        ]);

        const trends = await calculateDailyTrends(new Date('2026-04-01'), new Date('2026-04-02'), null);
        assert.deepEqual(trends, [
            {
                date: '2026-04-01',
                averageMood: 6,
                topKeywords: [
                    { keyword: 'calm', count: 2 },
                    { keyword: 'sleep', count: 1 },
                ],
                totalEntries: 2,
            },
            {
                date: '2026-04-02',
                averageMood: 4.5,
                topKeywords: [
                    { keyword: 'stress', count: 2 },
                    { keyword: 'focus', count: 1 },
                ],
                totalEntries: 2,
            },
        ]);

        MoodEntry.aggregate = async () => ([
            { _id: 'Work', count: 4 },
            { _id: 'Health', count: 2 },
            { _id: null, count: 1 },
        ]);

        const categories = await calculateCategoryDistribution(new Date('2026-04-01'), new Date('2026-04-02'), null);
        assert.deepEqual(categories, [
            { name: 'Work', value: 4 },
            { name: 'Health', value: 2 },
            { name: 'Uncategorized', value: 1 },
        ]);
    } finally {
        MoodEntry.aggregate = originalAggregate;
    }
}

async function main() {
    let server;

    try {
        server = app.listen(0);
        await new Promise((resolve) => server.once('listening', resolve));
        const { port } = server.address();
        const baseUrl = `http://127.0.0.1:${port}`;

        await runHealthAndAuthTests(baseUrl);
        await runTrendUtilityTests();

        console.log('6. All tests passed');
    } catch (error) {
        console.error('Test failure:', error);
        process.exitCode = 1;
    } finally {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((error) => (error ? reject(error) : resolve()));
            });
        }
    }
}

main();
