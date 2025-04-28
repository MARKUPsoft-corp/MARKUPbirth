import { useRuntimeConfig } from 'nuxt/app';

export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  
  /**
   * Generic GET request
   */
  const get = async (endpoint: string, params: Record<string, any> = {}) => {
    try {
      const queryString = Object.keys(params).length
        ? `?${new URLSearchParams(params).toString()}`
        : '';
        
      const response = await fetch(`${apiBaseUrl}${endpoint}${queryString}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  };
  
  /**
   * Generic POST request
   */
  const post = async (endpoint: string, data: any) => {
    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  };
  
  /**
   * Form data POST request (for file uploads)
   */
  const uploadFormData = async (endpoint: string, formData: FormData) => {
    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API upload error:', error);
      throw error;
    }
  };
  
  /**
   * Generic DELETE request
   */
  const del = async (endpoint: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  };
  
  return {
    get,
    post,
    uploadFormData,
    del,
  };
}; 