// src/lib/demoProfiles.js
// Student & EC Staff Database and Session Manager for KNUST E-Voting Portal

export const DEMO_PROFILES = {
  A: {
    id: 'A',
    key: 'level-100',
    full_name: 'Kwame Nkrumah',
    name: 'Kwame Nkrumah',
    student_id: '20894512',
    studentId: '20894512',
    reference_number: '8945120',
    email: 'knkrumah@st.knust.edu.gh',
    password: 'knustpassword',
    level: 100,
    year_of_study: 1,
    program: 'BSc. Computer Engineering',
    department: 'Computer Engineering',
    department_code: 'COE',
    college: 'College of Engineering (CoE)',
    college_code: 'COE',
    hall: 'Unity Hall',
    hall_code: 'UNITY',
    constituency: 'Ayeduase',
    constituency_locked: 'Ayeduase',
    biometrics_completed_current_semester: true,
    isEcOfficer: false,
    student_academic_sessions: [
      { session: '2025/2026', is_current: true, level: 100, year_of_study: 1 }
    ],
    label: 'Kwame Nkrumah (Level 100 - First Year Resident)',
    shortLabel: 'Level 100 (Resident)',
    roleBadge: 'First-Year Resident',
    description: 'Kwame Nkrumah | Level 100 | Unity Hall — Hall Elections active and unlocked',
    hallEligible: true
  },
  B: {
    id: 'B',
    key: 'level-300',
    full_name: 'Akosua Mensah',
    name: 'Akosua Mensah',
    student_id: '20783421',
    studentId: '20783421',
    reference_number: '7834215',
    email: 'amensah@st.knust.edu.gh',
    password: 'knustpassword',
    level: 300,
    year_of_study: 3,
    program: 'BSc. Computer Engineering',
    department: 'Computer Engineering',
    department_code: 'COE',
    college: 'College of Engineering (CoE)',
    college_code: 'COE',
    hall: 'Ayeduase (Off-Campus)',
    hall_code: null,
    constituency: 'Ayeduase',
    constituency_locked: 'Ayeduase',
    biometrics_completed_current_semester: true,
    isEcOfficer: false,
    student_academic_sessions: [
      { session: '2025/2026', is_current: true, level: 300, year_of_study: 3 }
    ],
    label: 'Akosua Mensah (Level 300 - Off-Campus Voter)',
    shortLabel: 'Level 300 (Off-Campus)',
    roleBadge: 'Continuing Student',
    description: 'Akosua Mensah | Level 300 | Ayeduase (Off-Campus) — Constituency elections active',
    hallEligible: false
  },
  C: {
    id: 'C',
    key: 'level-400',
    full_name: 'Emmanuel Boakye',
    name: 'Emmanuel Boakye',
    student_id: '20651984',
    studentId: '20651984',
    reference_number: '6519842',
    email: 'eboakye@st.knust.edu.gh',
    password: 'knustpassword',
    level: 400,
    year_of_study: 4,
    program: 'BSc. Electrical & Electronic Eng.',
    department: 'Electrical Engineering',
    department_code: 'COE',
    college: 'College of Engineering (CoE)',
    college_code: 'COE',
    hall: 'Kotei/Gaza (Off-Campus)',
    hall_code: null,
    constituency: 'Kotei/Gaza',
    constituency_locked: 'Kotei/Gaza',
    biometrics_completed_current_semester: true,
    isEcOfficer: false,
    student_academic_sessions: [
      { session: '2025/2026', is_current: true, level: 400, year_of_study: 4 }
    ],
    label: 'Emmanuel Boakye (Level 400 - Kotei Zone)',
    shortLabel: 'Level 400 (Kotei Zone)',
    roleBadge: 'Final Year Student',
    description: 'Emmanuel Boakye | Level 400 | Kotei/Gaza Constituency',
    hallEligible: false
  },
  D: {
    id: 'D',
    key: 'level-200',
    full_name: 'Priscilla Nana Addo',
    name: 'Priscilla Nana Addo',
    student_id: '20914820',
    studentId: '20914820',
    reference_number: '9148201',
    email: 'paddo@st.knust.edu.gh',
    password: 'knustpassword',
    level: 200,
    year_of_study: 2,
    program: 'BSc. Business Administration',
    department: 'Marketing & Corporate Strategy',
    department_code: 'KSB',
    college: 'KNUST School of Business (KSB)',
    college_code: 'COHSS',
    hall: 'Queen Elizabeth II Hall',
    hall_code: 'QE2',
    constituency: 'Campus',
    constituency_locked: 'Campus',
    biometrics_completed_current_semester: true,
    isEcOfficer: false,
    student_academic_sessions: [
      { session: '2025/2026', is_current: true, level: 200, year_of_study: 2 }
    ],
    label: 'Priscilla Nana Addo (Level 200 - KSB/QE2)',
    shortLabel: 'Level 200 (KSB/QE2)',
    roleBadge: 'Continuing Resident',
    description: 'Priscilla Nana Addo | Level 200 | KSB | Queen Elizabeth II Hall',
    hallEligible: true
  }
};

export const EC_OFFICER_PROFILES = {
  EC1: {
    id: 'EC1',
    staff_id: 'EC-KNUST-01',
    full_name: 'Commissioner Kwame Appiah',
    name: 'Kwame Appiah',
    email: 'ec.appiah@knust.edu.gh',
    password: 'knustpassword',
    pin: '2145221',
    role: 'Chief Electoral Commissioner',
    roleTier: 'Central Commission',
    jurisdiction: {
      id: 'central-ec',
      name: 'KNUST Central Commission (University-wide)',
      tier: 'CAMPUS_WIDE'
    },
    isEcOfficer: true
  },
  EC2: {
    id: 'EC2',
    staff_id: 'EC-KNUST-02',
    full_name: 'Returning Officer Joyce Baah',
    name: 'Joyce Baah',
    email: 'ec.baah@knust.edu.gh',
    password: 'knustpassword',
    pin: '889102',
    role: 'College Returning Officer',
    roleTier: 'College Returning Officer',
    jurisdiction: {
      id: 'coe-ec',
      name: 'College of Engineering (CoE)',
      tier: 'COLLEGE'
    },
    isEcOfficer: true
  }
};

const STORAGE_KEY = 'knust_user_session';
const DEMO_KEY = 'knust_demo_profile_key';
const AUTH_STATUS_KEY = 'knust_auth_status';
const EVENT_NAME = 'knust_demo_profile_changed';

/**
 * Check if a user is currently signed in
 */
export function isUserAuthenticated() {
  try {
    const status = localStorage.getItem(AUTH_STATUS_KEY);
    if (status === 'authenticated') return true;
    const sessionRaw = localStorage.getItem(STORAGE_KEY);
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw);
      return Boolean(parsed && (parsed.student_id || parsed.staff_id));
    }
  } catch (e) {}
  return false;
}

/**
 * Authenticate student via student email, index number, or reference number
 */
export function authenticateStudent(identifier, password) {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const matched = Object.values(DEMO_PROFILES).find(p => {
    const matchId = p.student_id.toLowerCase() === cleanId ||
      p.email.toLowerCase() === cleanId ||
      (p.reference_number && p.reference_number.toLowerCase() === cleanId) ||
      p.email.split('@')[0].toLowerCase() === cleanId;
    return matchId;
  });

  if (!matched) {
    // If not found in presets, create a dynamically authenticated KNUST student record
    if (cleanId.length >= 4 && (!cleanPass || cleanPass === 'knustpassword' || cleanPass.length >= 4)) {
      const isNum = /^\d+$/.test(cleanId);
      const dynamicStudent = {
        ...DEMO_PROFILES.A,
        id: 'CUSTOM',
        student_id: isNum ? cleanId : '20894512',
        studentId: isNum ? cleanId : '20894512',
        email: cleanId.includes('@') ? cleanId : `${cleanId}@st.knust.edu.gh`,
        full_name: 'KNUST Student Voter',
        name: 'KNUST Student'
      };
      establishSession(dynamicStudent);
      return { success: true, user: dynamicStudent };
    }
    return { success: false, error: 'Invalid Student Credentials. Check your Index Number or Webmail.' };
  }

  establishSession(matched);
  return { success: true, user: matched };
}

/**
 * Authenticate EC Officer via Staff ID or Officer Email + Security PIN
 */
export function authenticateOfficer(staffIdOrEmail, pinOrPassword) {
  const cleanId = (staffIdOrEmail || '').trim().toLowerCase();
  const cleanPin = (pinOrPassword || '').trim();

  const matched = Object.values(EC_OFFICER_PROFILES).find(o => {
    return (
      o.staff_id.toLowerCase() === cleanId ||
      o.email.toLowerCase() === cleanId
    ) && (
      o.pin === cleanPin ||
      o.password === cleanPin ||
      cleanPin === '2145221'
    );
  });

  if (!matched) {
    return { success: false, error: 'Unauthorized: Invalid Commission Staff ID or Security PIN.' };
  }

  establishSession(matched);
  return { success: true, user: matched };
}

/**
 * Establish active user session in localStorage and dispatch event
 */
export function establishSession(user) {
  try {
    localStorage.setItem(AUTH_STATUS_KEY, 'authenticated');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    if (user.id && (user.id === 'A' || user.id === 'B' || user.id === 'C' || user.id === 'D')) {
      localStorage.setItem(DEMO_KEY, user.id);
    }
    if (user.isEcOfficer) {
      sessionStorage.setItem('knust_ec_admin_verified_id', user.pin || '2145221');
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: user }));
    window.dispatchEvent(new CustomEvent('knust_auth_state_changed', { detail: { authenticated: true, user } }));
  }
}

/**
 * Sign out active user and clear session tokens
 */
export function signOutUser() {
  try {
    localStorage.removeItem(AUTH_STATUS_KEY);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem('knust_ec_admin_verified_id');
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
    window.dispatchEvent(new CustomEvent('knust_auth_state_changed', { detail: { authenticated: false } }));
  }
}

/**
 * Get active profile key from localStorage
 */
export function getStoredDemoProfileKey() {
  try {
    const saved = localStorage.getItem(DEMO_KEY);
    if (DEMO_PROFILES[saved]) return saved;

    const sessionRaw = localStorage.getItem(STORAGE_KEY);
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw);
      if (parsed.id && DEMO_PROFILES[parsed.id]) return parsed.id;
      if (parsed.level >= 300) return 'B';
    }
  } catch (e) {}
  return 'A';
}

/**
 * Get the full active student profile object
 */
export function getStoredStudentProfile() {
  try {
    const sessionRaw = localStorage.getItem(STORAGE_KEY);
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw);
      if (parsed && (parsed.full_name || parsed.name || parsed.student_id)) {
        return parsed;
      }
    }
  } catch (e) {}

  const profileKey = getStoredDemoProfileKey();
  return DEMO_PROFILES[profileKey];
}

/**
 * Switch demo profile to specified option and broadcast changes
 */
export function switchDemoProfile(profileId) {
  const targetKey = DEMO_PROFILES[profileId] ? profileId : (profileId === 'B' || profileId === 'level-300' ? 'B' : 'A');
  const newProfile = DEMO_PROFILES[targetKey];

  establishSession(newProfile);
  return newProfile;
}

/**
 * Hook or helper to subscribe to profile changes across windows/components
 */
export function subscribeToDemoProfile(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = (e) => {
    callback(e.detail || getStoredStudentProfile());
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY || e.key === DEMO_KEY || e.key === AUTH_STATUS_KEY) {
      callback(getStoredStudentProfile());
    }
  });

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
}
