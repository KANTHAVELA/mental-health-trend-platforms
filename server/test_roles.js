const axios = require('axios');

async function runTests() {
  const baseUrl = 'http://localhost:5000/api';

  console.log('--- Starting Role Verification Tests ---');

  try {
    // 1. Create Patient
    console.log('\n[Test 1] Creating Patient User...');
    const patientData = {
      username: `patient_test_${Date.now()}`,
      email: `patient_${Date.now()}@test.com`,
      password: 'password123',
      role: 'patient'
    };
    
    let resPatient = await axios.post(`${baseUrl}/auth/register`, patientData);
    console.log(`Patient Created. ID: ${resPatient.data._id}, Role: ${resPatient.data.role}`);
    if(resPatient.data.role !== 'patient') throw new Error("Role was not correctly set to patient");

    // 2. Create Doctor (Psychologist)
    console.log('\n[Test 2] Creating Doctor User...');
    const doctorData = {
      username: `doctor_test_${Date.now()}`,
      email: `doctor_${Date.now()}@test.com`,
      password: 'password123',
      role: 'psychologist'
    };
    
    let resDoctor = await axios.post(`${baseUrl}/auth/register`, doctorData);
    console.log(`Doctor Created. ID: ${resDoctor.data._id}, Role: ${resDoctor.data.role}`);
    if(resDoctor.data.role !== 'psychologist') throw new Error("Role was not correctly set to psychologist");

    console.log('\n✅ All backend registration tests passed!');
  } catch(e) {
    console.error('❌ Test failed:', e.response?.data?.message || e.message);
  }
}

runTests();
