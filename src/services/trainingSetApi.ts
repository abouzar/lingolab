import { apiClient, type ApiResponse } from './api'
import type { TrainingSet } from '../types'

// Training Set API types
export interface CreateTrainingSetRequest {
  name: string
  description?: string
  category?: string
  wordIds: string[]
  isPublic?: boolean
}

export interface UpdateTrainingSetRequest {
  name?: string
  description?: string
  category?: string
  wordIds?: string[]
  isPublic?: boolean
}

export interface AddWordsToSetRequest {
  wordIds: string[]
}

export interface RemoveWordsFromSetRequest {
  wordIds: string[]
}

export interface ReorderWordsRequest {
  wordOrders: Array<{
    wordId: string
    order: number
  }>
}

export interface TrainingSetStats {
  totalWords: number
  averageDifficulty: number
  estimatedStudyTime: number
  createdAt: string
  updatedAt: string
}

export class TrainingSetApi {
  // Get all training sets
  static async getTrainingSets(params?: {
    limit?: number
    offset?: number
    category?: string
  }): Promise<ApiResponse<TrainingSet[]>> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    if (params?.category) searchParams.append('category', params.category)

    const endpoint = `/v1/training-sets${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return apiClient.get<TrainingSet[]>(endpoint)
  }

  // Search training sets
  static async searchTrainingSets(query: string, limit?: number): Promise<ApiResponse<TrainingSet[]>> {
    const searchParams = new URLSearchParams({ q: query })
    if (limit) searchParams.append('limit', limit.toString())

    return apiClient.get<TrainingSet[]>(`/v1/training-sets/search?${searchParams.toString()}`)
  }

  // Get training set by ID
  static async getTrainingSetById(id: string): Promise<ApiResponse<TrainingSet>> {
    return apiClient.get<TrainingSet>(`/v1/training-sets/${id}`)
  }

  // Get training set statistics
  static async getTrainingSetStats(id: string): Promise<ApiResponse<TrainingSetStats>> {
    return apiClient.get<TrainingSetStats>(`/v1/training-sets/${id}/stats`)
  }

  // Create new training set
  static async createTrainingSet(data: CreateTrainingSetRequest): Promise<ApiResponse<TrainingSet>> {
    return apiClient.post<TrainingSet>('/v1/training-sets', data)
  }

  // Update training set
  static async updateTrainingSet(id: string, data: UpdateTrainingSetRequest): Promise<ApiResponse<TrainingSet>> {
    return apiClient.put<TrainingSet>(`/v1/training-sets/${id}`, data)
  }

  // Delete training set
  static async deleteTrainingSet(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/v1/training-sets/${id}`)
  }

  // Add words to training set
  static async addWordsToSet(id: string, data: AddWordsToSetRequest): Promise<ApiResponse<TrainingSet>> {
    return apiClient.post<TrainingSet>(`/v1/training-sets/${id}/words`, data)
  }

  // Remove words from training set
  static async removeWordsFromSet(id: string, data: RemoveWordsFromSetRequest): Promise<ApiResponse<TrainingSet>> {
    return apiClient.delete<TrainingSet>(`/v1/training-sets/${id}/words`, data)
  }

  // Reorder words in training set
  static async reorderWords(id: string, data: ReorderWordsRequest): Promise<ApiResponse<TrainingSet>> {
    return apiClient.put<TrainingSet>(`/v1/training-sets/${id}/words/reorder`, data)
  }
}