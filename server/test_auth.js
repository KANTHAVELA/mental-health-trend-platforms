const bcrypt = require('bcryptjs');
const hash = '$2b$10$13j0rev3YEwc4/zJbfezY.tFePqDjHVBpg5CJMi/bw/ljCRguxlSG';
const password = 'hashedpassword123';
bcrypt.compare(password, hash).then(result => {
    console.log('Password match:', result);
    process.exit(0);
});
