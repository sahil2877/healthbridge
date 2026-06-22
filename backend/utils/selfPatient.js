const Patient = require('../models/Patient');

// Resolve (or lazily create) the clinical Patient record that belongs to a
// logged-in patient user. The bridge between a patient *login* (User) and their
// clinical data (Patient) is:
//   1) a Patient already linked via its `user` field, else
//   2) a Patient onboarded by a provider with the same email (link it now), else
//   3) a fresh minimal Patient record created for this user.
async function getOrCreateSelfPatient(user) {
  let patient = await Patient.findOne({ user: user.id });
  if (patient) return patient;

  if (user.email) {
    patient = await Patient.findOne({ email: user.email });
    if (patient) {
      patient.user = user.id;
      await patient.save();
      return patient;
    }
  }

  return Patient.create({ name: user.name, email: user.email, user: user.id });
}

module.exports = { getOrCreateSelfPatient };
