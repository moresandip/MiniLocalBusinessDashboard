class ServerManager {
  private static instance: ServerManager;
  private serverStarted = false;
  private startPromise: Promise<boolean> | null = null;

  private constructor() {}

  static getInstance(): ServerManager {
    if (!ServerManager.instance) {
      ServerManager.instance = new ServerManager();
    }
    return ServerManager.instance;
  }

  async ensureServerRunning(): Promise<boolean> {
    if (this.serverStarted) {
      return true;
    }

    if (this.startPromise) {
      return this.startPromise;
    }

    this.startPromise = this.startServerSilently();
    const result = await this.startPromise;
    this.startPromise = null;
    
    if (result) {
      this.serverStarted = true;
    }
    
    return result;
  }

  private async startServerSilently(): Promise<boolean> {
    try {
      // Check if server is already running
      const healthCheck = await this.checkServerHealth();
      if (healthCheck) {
        return true;
      }

      // Try to start server by making requests that might trigger auto-start
      console.log('Attempting to start server silently...');
      
      // Multiple attempts to trigger server start
      const startAttempts = [
        () => fetch('http://localhost:3001/', { mode: 'no-cors' }).catch(() => {}),
        () => fetch('http://localhost:3001/health', { mode: 'no-cors' }).catch(() => {}),
        () => fetch('http://localhost:3001/api', { mode: 'no-cors' }).catch(() => {})
      ];

      // Execute all start attempts
      await Promise.all(startAttempts.map(attempt => attempt()));

      // Wait for server to potentially start
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check if server is now running
      return await this.checkServerHealth();
    } catch (error) {
      console.log('Silent server start failed:', error);
      return false;
    }
  }

  private async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async makeApiRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure server is running before making request
    const serverRunning = await this.ensureServerRunning();
    
    if (!serverRunning) {
      // If server can't be started, throw error to trigger fallback
      throw new Error('Server not available');
    }

    const response = await fetch(`http://localhost:3001${endpoint}`, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
      signal: AbortSignal.timeout(10000), // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Server error (${response.status})`);
    }

    return response.json();
  }
}

export const serverManager = ServerManager.getInstance();
export default ServerManager;