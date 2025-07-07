interface ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = 'http://localhost:3001', timeout: number = 15000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      
      let errorMessage = 'Request failed';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out';
        } else if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Cannot connect to server';
        } else {
          errorMessage = error.message;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  }

  async checkHealth(): Promise<ApiResponse<{ status: string; uptime: number }>> {
    return this.makeRequest('/health');
  }

  async getBusinessData(name: string, location: string): Promise<ApiResponse<{
    name: string;
    location: string;
    rating: number;
    reviews: number;
    headline: string;
  }>> {
    return this.makeRequest('/business-data', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim(), location: location.trim() }),
    });
  }

  async regenerateHeadline(name: string, location: string): Promise<ApiResponse<{
    headline: string;
  }>> {
    const params = new URLSearchParams({
      name: name.trim(),
      location: location.trim(),
    });
    
    return this.makeRequest(`/regenerate-headline?${params}`);
  }

  async testConnection(): Promise<boolean> {
    const result = await this.checkHealth();
    return result.success;
  }
}

export const apiClient = new ApiClient();
export default ApiClient;