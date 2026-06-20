// Representative catalog data for the patient portal.
// (In a later phase this comes from a backend /catalog API; kept static for now.)

export interface LabPackage {
  id: string;
  name: string;
  tests: number;
  price: number;     // offer price (₹)
  mrp: number;       // strikethrough price
  category: string;  // Popular | Vitamins | Thyroid | Kidney | Liver | Allergy
}

export const TEST_CATEGORIES = ['Popular', 'Vitamins', 'Thyroid', 'Kidney', 'Liver', 'Allergy'];

export const LAB_PACKAGES: LabPackage[] = [
  { id: 'p1', name: 'Healthy India Full Body Checkup', tests: 81, price: 1143, mrp: 4999, category: 'Popular' },
  { id: 'p2', name: 'Full Body Checkup Lite',          tests: 80, price: 1046, mrp: 3999, category: 'Popular' },
  { id: 'p3', name: 'Vitamin Deficiency Assessment',   tests: 2,  price: 831,  mrp: 1500, category: 'Vitamins' },
  { id: 'p4', name: 'Vitamin Plus Package',            tests: 3,  price: 1000, mrp: 1800, category: 'Vitamins' },
  { id: 'p5', name: 'Thyroid Profile Total',           tests: 3,  price: 399,  mrp: 900,  category: 'Thyroid' },
  { id: 'p6', name: 'Kidney Function Test (KFT)',       tests: 10, price: 504,  mrp: 1681, category: 'Kidney' },
  { id: 'p7', name: 'Liver Function Test (LFT)',        tests: 11, price: 499,  mrp: 1600, category: 'Liver' },
  { id: 'p8', name: 'Comprehensive Allergy Panel',     tests: 4,  price: 1299, mrp: 2600, category: 'Allergy' }
];

// Category tiles on the home screen
export const SERVICE_TILES = [
  { icon: '🩸', title: 'Blood Tests', offer: 'Up to 79% off' },
  { icon: '🩻', title: 'X-Rays, Scans & MRI', offer: 'Up to 70% off' },
  { icon: '🧑‍⚕️', title: 'Doctor & Diet Consult', offer: 'Up to 75% off' }
];

// Segmented care plans
export const CARE_PLANS = [
  { title: 'Women Care', sub: 'Specialized health packages', emoji: '👩' },
  { title: 'Men Care', sub: 'Comprehensive checkups', emoji: '👨' },
  { title: 'Elderly Care', sub: 'Senior citizen health', emoji: '🧓' }
];

// "Book tests by organ"
export const ORGAN_TESTS = [
  { organ: 'Bone', desc: 'Bone health assessment', price: 504, mrp: 1681, emoji: '🦴' },
  { organ: 'Stomach', desc: 'Stomach health assessment', price: 808, mrp: 2695, emoji: '胃' },
  { organ: 'Heart', desc: 'Cardiac risk assessment', price: 899, mrp: 2999, emoji: '❤️' },
  { organ: 'Kidney', desc: 'Kidney function assessment', price: 834, mrp: 2100, emoji: '🫘' }
];

// Health trackers shown in the Vitals tab
export const HEALTH_TRACKERS = [
  { key: 'steps', title: 'Step Count', emoji: '👣', unit: 'steps' },
  { key: 'sugar', title: 'Log Sugar', emoji: '🩸', unit: 'mg/dL' },
  { key: 'weight', title: 'Track Weight', emoji: '⚖️', unit: 'kg' },
  { key: 'bp', title: 'Blood Pressure', emoji: '🫀', unit: 'mmHg' },
  { key: 'medicine', title: 'Track Medicine', emoji: '💊', unit: '' },
  { key: 'heart', title: 'Heart Rate', emoji: '💓', unit: 'bpm' }
];

// Checkup journey steps (the stepper)
export const CHECKUP_JOURNEY = [
  { title: 'Book with Ease', desc: 'Choose your test, time slot and book instantly.', emoji: '📅' },
  { title: 'Home Collection', desc: 'Safe sample collection by trained phlebotomist.', emoji: '🏠' },
  { title: 'Secure Transfer to Lab', desc: 'Temperature-controlled, safe transport.', emoji: '🚚' },
  { title: 'Quick Report Access', desc: 'Reports within 6 hours via WhatsApp, SMS & Email.', emoji: '📋' }
];
