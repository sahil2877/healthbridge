// Seeds four easy-to-remember demo accounts (one per role) for quick logins.
// Idempotent: re-running updates the same accounts instead of duplicating them.
// Run:  node seed/seedDemoUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');

// email + password kept deliberately simple so they're easy to demo.
const DEMO_USERS = [
  { role: 'admin',   name: 'Demo Admin',   email: 'admin@demo.com',   password: 'admin123' },
  { role: 'doctor',  name: 'Dr. Demo',     email: 'doctor@demo.com',  password: 'doctor123' },
  { role: 'staff',   name: 'Demo Staff',   email: 'staff@demo.com',   password: 'staff123' },
  { role: 'patient', name: 'Demo Patient', email: 'patient@demo.com', password: 'patient123',
    age: 30, gender: 'Male', phone: '9876543210', bloodGroup: 'O+' }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const u of DEMO_USERS) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(u.password, salt);

    // Upsert by email so re-running just refreshes name/role/password.
    const user = await User.findOneAndUpdate(
      { email: u.email },
      { name: u.name, email: u.email, password: hashed, role: u.role },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // The patient also needs a linked clinical record (same as a real signup).
    if (u.role === 'patient') {
      await Patient.findOneAndUpdate(
        { user: user._id },
        { name: u.name, email: u.email, age: u.age, gender: u.gender,
          phone: u.phone, bloodGroup: u.bloodGroup, user: user._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`✔ ${u.role.padEnd(8)} ${u.email}  /  ${u.password}`);
  }

  console.log('\nDone. Use the credentials above to log in.');
  await mongoose.disconnect();
})().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
