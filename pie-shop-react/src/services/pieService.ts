/**
 * Pie Service - API calls for pie data
 * Converted from vanilla JS fetch functions to TypeScript services
 */

import { Pie } from '../types/pie';

const API_BASE = '/api';

class PieService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Fetch all pies, optionally filtered by category
   * @param category - Optional category filter
   * @returns Promise<Pie[]> - Array of pie objects
   */
  async getPies(category?: string): Promise<Pie[]> {
    try {
      const url = new URL(`${API_BASE}/pies`, window.location.origin);
      if (category) {
        url.searchParams.set('category', category);
      }
      
      const response = await fetch(url.toString());
      return this.handleResponse<Pie[]>(response);
    } catch (error) {
      console.error('Failed to fetch pies:', error);
      throw new Error('Failed to fetch pies');
    }
  }

  /**
   * Fetch pies of the month
   * @returns Promise<Pie[]> - Array of monthly pie objects
   */
  async getMonthlyPies(): Promise<Pie[]> {
    try {
      const response = await fetch(`${API_BASE}/pies-of-the-month`);
      return this.handleResponse<Pie[]>(response);
    } catch (error) {
      console.error('Failed to fetch monthly pies:', error);
      throw new Error('Failed to fetch monthly pies');
    }
  }

  /**
   * Search pies by query and category
   * @param query - Search query string
   * @param category - Optional category filter
   * @returns Promise<Pie[]> - Filtered array of pie objects
   */
  async searchPies(query: string, category?: string): Promise<Pie[]> {
    try {
      const url = new URL(`${API_BASE}/pies`, window.location.origin);
      if (query) {
        url.searchParams.set('search', query);
      }
      if (category) {
        url.searchParams.set('category', category);
      }
      
      const response = await fetch(url.toString());
      return this.handleResponse<Pie[]>(response);
    } catch (error) {
      console.error('Failed to search pies:', error);
      throw new Error('Failed to search pies');
    }
  }
}

// Export singleton instance
export const pieService = new PieService();
export default pieService;
