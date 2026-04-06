const ALLOWED_ROLES = ['patient', 'psychologist', 'admin'];
const ALLOWED_ENTRY_CATEGORIES = ['General', 'Work', 'Social', 'Health', 'Family', 'Personal'];

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeEmail = (value) => normalizeString(value).toLowerCase();
const normalizeArray = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map((item) => normalizeString(item)).filter(Boolean);
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function validateAuthPayload(payload, options = {}) {
    const { requireUsername = false, requireRole = false } = options;
    const username = normalizeString(payload?.username);
    const email = normalizeEmail(payload?.email);
    const password = normalizeString(payload?.password);
    const role = normalizeString(payload?.role);
    const errors = [];

    if (requireUsername && username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }

    if (!isValidEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (requireRole && !ALLOWED_ROLES.includes(role)) {
        errors.push(`Role must be one of: ${ALLOWED_ROLES.join(', ')}`);
    }

    return {
        errors,
        data: {
            username,
            email,
            password,
            role: ALLOWED_ROLES.includes(role) ? role : 'patient',
        },
    };
}

function validateMoodEntryPayload(payload, options = {}) {
    const { requireUserId = false } = options;
    const userId = normalizeString(payload?.userId);
    const emotion = Number(payload?.emotion);
    const category = normalizeString(payload?.category) || 'General';
    const keywords = normalizeArray(payload?.keywords);
    const notes = normalizeString(payload?.notes);
    const errors = [];

    if (requireUserId && !userId) {
        errors.push('userId is required');
    }

    if (!Number.isFinite(emotion) || emotion < 1 || emotion > 10) {
        errors.push('emotion must be a number between 1 and 10');
    }

    if (!ALLOWED_ENTRY_CATEGORIES.includes(category)) {
        errors.push(`category must be one of: ${ALLOWED_ENTRY_CATEGORIES.join(', ')}`);
    }

    let timestamp;
    if (payload?.timestamp) {
        timestamp = new Date(payload.timestamp);
        if (Number.isNaN(timestamp.getTime())) {
            errors.push('timestamp must be a valid date');
        }
    }

    return {
        errors,
        data: {
            userId,
            emotion,
            keywords,
            category,
            notes,
            timestamp,
        },
    };
}

function validatePersonalNotePayload(payload) {
    const title = normalizeString(payload?.title);
    const content = normalizeString(payload?.content);
    const category = normalizeString(payload?.category) || 'General';
    const errors = [];

    if (title.length < 3) {
        errors.push('Title must be at least 3 characters long');
    }

    if (content.length < 5) {
        errors.push('Content must be at least 5 characters long');
    }

    return {
        errors,
        data: {
            title,
            content,
            category,
        },
    };
}

module.exports = {
    ALLOWED_ENTRY_CATEGORIES,
    ALLOWED_ROLES,
    normalizeArray,
    normalizeEmail,
    normalizeString,
    validateAuthPayload,
    validateMoodEntryPayload,
    validatePersonalNotePayload,
};
