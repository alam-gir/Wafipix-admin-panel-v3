/**
 * Base API service with common functionality
 */

import { apiClient } from '../../api/client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export abstract class BaseApiService {
  protected baseEndpoint: string;

  constructor(baseEndpoint: string) {
    this.baseEndpoint = baseEndpoint;
  }

  /**
   * Generic GET request for paginated data
   */
  protected async getPaginated<T>(
    endpoint: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  }

  /**
   * Generic GET request for single item
   */
  protected async getById<T>(id: string): Promise<T> {
    const response = await apiClient.get(`${this.baseEndpoint}/${id}`);
    return response.data.data;
  }

  /**
   * Generic POST request for creating items
   */
  protected async create<T, TCreateData>(data: TCreateData): Promise<T> {
    const response = await apiClient.post(this.baseEndpoint, data);
    return response.data.data;
  }

  /**
   * Generic PUT request for updating items
   */
  protected async update<T, TUpdateData>(id: string, data: TUpdateData): Promise<T> {
    const response = await apiClient.put(`${this.baseEndpoint}/${id}`, data);
    return response.data.data;
  }

  /**
   * Generic DELETE request
   */
  protected async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Generic PATCH request for partial updates
   */
  protected async patch<T>(id: string, data: Partial<T>): Promise<T> {
    const response = await apiClient.patch(`${this.baseEndpoint}/${id}`, data);
    return response.data.data;
  }
}
