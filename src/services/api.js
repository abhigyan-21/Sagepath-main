const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API helper function
const apiCall = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
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
export const communityAPI = {
    getPosts: (type) => apiCall(`/community${type ? `?type=${type}` : ''}`),
    
    createPost: (data) => 
        apiCall('/community', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    
    likePost: (postId) => 
        apiCall(`/community/${postId}/like`, { method: 'POST' }),
    
    commentPost: (postId, text) => 
        apiCall(`/community/${postId}/comment`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        }),
};
