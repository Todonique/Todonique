const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const defaultHeaders = {
  "Content-Type": "application/json",
};

/**
 * API request function
 * @param {string} endpoint - api endpoint ("/todos")
 * @param {Object} options
 * @param {string} [options.method="GET"] - method
 * @param {Object} [options.body] - request payload
 * @param {boolean} [options.auth=false] - optional to include authorization header
 */
export async function apiRequest(endpoint, {
  method,
  body,
  auth = false
} = {}) {
  try {
    const headers = { ...defaultHeaders };

    if (auth) {
      const resolvedToken = localStorage.getItem("authToken"); // or cookie wherever we choose to store it
      if (!resolvedToken) throw new Error("Authentication token is required.");
      headers.Authorization = `Bearer ${resolvedToken}`;
    }

    const fetchOptions = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(data?.message || response.error ||response.statusText);
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}
