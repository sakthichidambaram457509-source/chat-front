export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://chat-6oy5.onrender.com";

// Derive WebSocket URL from API_BASE_URL
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");
