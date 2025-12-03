const API_URL = import.meta.env.VITE_API_URL || '/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API helper function
const apiCall = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
};

// Auth API
export const authAPI = {
    login: (email, password) =>
        apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (name, email, password) =>
        apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        }),

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return apiCall('/auth/logout', { method: 'POST' });
    },

    resetPassword: (email) =>
        apiCall('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),
};

// User API
export const userAPI = {
    getProfile: () => apiCall('/users/profile'),

    updateProfile: (data) =>
        apiCall('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    addFriend: (friendId) =>
        apiCall(`/users/friends/${friendId}`, { method: 'POST' }),

    getActiveCourse: () => apiCall('/users/active-course'),
};

// Course API
export const courseAPI = {
    getAll: () => apiCall('/courses'),

    getById: (id) => apiCall(`/courses/${id}`),

    updateProgress: (courseId, topicId) =>
        apiCall(`/courses/${courseId}/progress`, {
            method: 'POST',
            body: JSON.stringify({ topicId }),
        }),

    askDoubt: (courseId, question) =>
        apiCall(`/courses/${courseId}/doubts`, {
            method: 'POST',
            body: JSON.stringify({ question }),
        }),
};

// Community API
// Community API
export const communityAPI = {
    getPosts: (type, sort, scope) => {
        let url = '/community?';
        if (type) url += `type=${type}&`;
        if (sort) url += `sort=${sort}&`;
        if (scope) url += `scope=${scope}`;
        return apiCall(url);
    },

    createPost: (data) => {
        const formData = new FormData();
        formData.append('type', data.type);
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.content) formData.append('content', data.content);
        if (data.image) formData.append('image', data.image);

        return apiCall('/community', {
            method: 'POST',
            body: formData,
            headers: {}, // Let browser set Content-Type
        });
    },

    likePost: (postId) =>
        apiCall(`/community/${postId}/like`, { method: 'POST' }),

    commentPost: (postId, text) =>
        apiCall(`/community/${postId}/comment`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        }),

    deletePost: (postId) =>
        apiCall(`/community/${postId}`, { method: 'DELETE' }),
};
