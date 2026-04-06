const test = require('node:test');
const assert = require('node:assert/strict');

const { app } = require('../server');

let server;
let baseUrl;

test.before(async () => {
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
    if (!server) {
        return;
    }

    await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
    });
});

test('health endpoint responds with application status', async () => {
    const response = await fetch(`${baseUrl}/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.status, 'ok');
});

test('registration validates input and stores requested role in demo mode', async () => {
    const invalidResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'ab',
            email: 'not-an-email',
            password: '123',
        }),
    });
    const invalidPayload = await invalidResponse.json();

    assert.equal(invalidResponse.status, 400);
    assert.match(invalidPayload.message, /Username|email|Password/i);

    const uniqueId = Date.now();
    const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: `doctor_${uniqueId}`,
            email: `doctor_${uniqueId}@test.com`,
            password: 'password123',
            role: 'psychologist',
        }),
    });
    const payload = await response.json();

    assert.equal(response.status, 201);
    assert.equal(payload.role, 'psychologist');
    assert.ok(payload.token);
});

test('login enforces role-based access controls for protected endpoints', async () => {
    const uniqueId = Date.now() + 1;

    const registerPatient = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: `patient_${uniqueId}`,
            email: `patient_${uniqueId}@test.com`,
            password: 'password123',
            role: 'patient',
        }),
    });
    assert.equal(registerPatient.status, 201);

    const patientLogin = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: `patient_${uniqueId}@test.com`,
            password: 'password123',
            role: 'patient',
        }),
    });
    const patientPayload = await patientLogin.json();
    assert.equal(patientLogin.status, 200);
    assert.ok(patientPayload.token);

    const forbiddenProviderAccess = await fetch(`${baseUrl}/api/provider/dashboard-analytics`, {
        headers: {
            Authorization: `Bearer ${patientPayload.token}`,
        },
    });
    assert.equal(forbiddenProviderAccess.status, 403);

    const patientAreaAccess = await fetch(`${baseUrl}/api/patient/me`, {
        headers: {
            Authorization: `Bearer ${patientPayload.token}`,
        },
    });
    assert.equal(patientAreaAccess.status, 200);

    const roleMismatchLogin = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: `patient_${uniqueId}@test.com`,
            password: 'password123',
            role: 'psychologist',
        }),
    });
    assert.equal(roleMismatchLogin.status, 401);
});
