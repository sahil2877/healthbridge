const Patient = require('../models/Patient');

// Resolve (or lazily create) the clinical Patient record that belongs to a
// logged-in patient user. The bridge between a patient *login* (User) and their
// clinical data (Patient) is:
//   1) a Patient already linked via its `user` field, else
//   2) a Patient onboarded by a provider with the same email (link it now), else
//   3) a Patient onboarded by a provider with the same name and no linked user
//      (the provider may not have entered an email), else
//   4) a fresh minimal Patient record created for this user.
async function getOrCreateSelfPatient(user) {
  // 1 — direct link
  let patient = await Patient.findOne({ user: user.id });
  if (patient) return patient;

  // 2 — match by email (the provider entered the patient's email)
  if (user.email) {
    patient = await Patient.findOne({ email: user.email });
    if (patient) {
      patient.user = user.id;
      await patient.save();
      return patient;
    }
  }

  // 3 — match by name for unlinked provider-onboarded patients (no email entered)
  // This prevents duplicates when a patient registers after being onboarded.
  patient = await Patient.findOne({
    name: user.name,
    user: { $exists: false }
  });
  if (patient) {
    patient.user = user.id;
    if (user.email && !patient.email) patient.email = user.email;
    await patient.save();
    return patient;
  }

  // 4 — no match found, create a fresh minimal record
  return Patient.create({ name: user.name, email: user.email, user: user.id });
}

module.exports = { getOrCreateSelfPatient };
