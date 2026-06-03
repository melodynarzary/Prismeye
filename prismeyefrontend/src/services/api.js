// API Service for Backend Communication

const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  // Get threat statistics
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/threats/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        byType: {}
      };
    }
  }

  // Get all threats
  async getThreats(limit = 100) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/threats`);
      const data = await response.json();
      return data.threats || [];
    } catch (error) {
      console.error('Failed to fetch threats:', error);
      return [];
    }
  }

  // Get threats by severity
  async getThreatsBySeverity(severity) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/threats/severity/${severity}`);
      const data = await response.json();
      return data.threats || [];
    } catch (error) {
      console.error(`Failed to fetch ${severity} threats:`, error);
      return [];
    }
  }

  // Get threats by type
  async getThreatsByType(type) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/threats/type/${encodeURIComponent(type)}`);
      const data = await response.json();
      return data.threats || [];
    } catch (error) {
      console.error(`Failed to fetch ${type} threats:`, error);
      return [];
    }
  }

  // Get HTTP status codes
  async getHttpStatusCodes() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/http-status-codes`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch HTTP status codes:', error);
      return {
        codes: [
          { code: '200', count: 0, label: 'OK' },
          { code: '403', count: 0, label: 'Forbidden' },
          { code: '404', count: 0, label: 'Not Found' },
          { code: '500', count: 0, label: 'Server Error' }
        ],
        total: 0
      };
    }
  }

  // Check if backend is running
  async checkBackendStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();
      return {
        online: true,
        ...data
      };
    } catch (error) {
      console.error('Backend is offline:', error);
      return {
        online: false,
        message: 'Backend server is not running'
      };
    }
  }
}

export default new ApiService();