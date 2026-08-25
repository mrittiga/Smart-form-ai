const FORMS_KEY = 'smartform_db_forms';
const SUBMISSIONS_KEY = 'smartform_db_submissions';
const USER_KEY = 'smartform_db_user';

// Initial seeds if database is empty
const defaultForms = [
  {
    id: 'form_1',
    title: 'Job Application Form',
    version: 1,
    createdAt: new Date().toISOString(),
    fields: ['fullName', 'email', 'phone', 'appliedRole', 'keySkills', 'experienceSummary']
  }
];

export const db = {
  // --- FORM PERSISTENCE & VERSIONING ---
  getForms: () => {
    const data = localStorage.getItem(FORMS_KEY);
    return data ? JSON.parse(data) : defaultForms;
  },

  saveForm: (form) => {
    const forms = db.getForms();
    const existingIdx = forms.findIndex(f => f.id === form.id);
    
    if (existingIdx >= 0) {
      // Create a new version entry for versioning history
      const current = forms[existingIdx];
      const updatedForm = {
        ...form,
        version: (current.version || 1) + 1,
        updatedAt: new Date().toISOString(),
        history: [...(current.history || []), { version: current.version, fields: current.fields, savedAt: new Date().toISOString() }]
      };
      forms[existingIdx] = updatedForm;
    } else {
      forms.push({
        ...form,
        id: `form_${Date.now()}`,
        version: 1,
        createdAt: new Date().toISOString()
      });
    }
    localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
    return forms;
  },

  // --- SUBMISSIONS PERSISTENCE ---
  getSubmissions: () => {
    const data = localStorage.getItem(SUBMISSIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSubmission: (submissionData) => {
    const submissions = db.getSubmissions();
    const newEntry = {
      id: `sub_${Date.now()}`,
      timestamp: new Date().toISOString(),
      data: submissionData
    };
    submissions.push(newEntry);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    return newEntry;
  },

  // --- USER PROFILE PERSISTENCE ---
  getUserProfile: () => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : { name: 'Mrittiga M', email: 'mrittigam@gmail.com' };
  },

  saveUserProfile: (profile) => {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  },

  // --- BACKUP & RESTORE SYSTEM ---
  exportDatabaseBackup: () => {
    const backupData = {
      forms: db.getForms(),
      submissions: db.getSubmissions(),
      user: db.getUserProfile(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartform_backup_${Date.now()}.json`;
    a.click();
  },

  importDatabaseBackup: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.forms) localStorage.setItem(FORMS_KEY, JSON.stringify(parsed.forms));
      if (parsed.submissions) localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(parsed.submissions));
      if (parsed.user) localStorage.setItem(USER_KEY, JSON.stringify(parsed.user));
      return true;
    } catch (e) {
      console.error('Invalid backup format', e);
      return false;
    }
  }
};
