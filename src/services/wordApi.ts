import { apiClient, type ApiResponse } from './api'
import type { Word } from '../types'

// Word API types
export interface CreateWordRequest {
  text: string
  translation: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'interjection' | 'article' | 'pronoun'
  difficulty?: number
  frequency?: number
  pronunciation?: string
  examples?: Array<{
    sentence: string
    translation: string
  }>
  attributes?: Array<{
    attributeType: 'article' | 'plural' | 'gender' | 'conjugation' | 'case'
    attributeValue: string
    context?: string
  }>
}

export interface UpdateWordRequest {
  text?: string
  translation?: string
  partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'interjection' | 'article' | 'pronoun'
  difficulty?: number
  frequency?: number
  pronunciation?: string
  examples?: Array<{
    sentence: string
    translation: string
  }>
  attributes?: Array<{
    attributeType: 'article' | 'plural' | 'gender' | 'conjugation' | 'case'
    attributeValue: string
    context?: string
  }>
}

export class WordApi {
  // Get all German words
  static async getWords(params?: {
    limit?: number
    offset?: number
    partOfSpeech?: string
    difficulty?: number
  }): Promise<ApiResponse<Word[]>> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    if (params?.partOfSpeech) searchParams.append('partOfSpeech', params.partOfSpeech)
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty.toString())

    const endpoint = `/v1/words${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return apiClient.get<Word[]>(endpoint)
  }

  // Search German words
  static async searchWords(query: string, limit?: number): Promise<ApiResponse<Word[]>> {
    const searchParams = new URLSearchParams({ q: query })
    if (limit) searchParams.append('limit', limit.toString())

    return apiClient.get<Word[]>(`/v1/words/search?${searchParams.toString()}`)
  }

  // Get word by ID
  static async getWordById(id: string): Promise<ApiResponse<Word>> {
    return apiClient.get<Word>(`/v1/words/${id}`)
  }

  // Create new German word
  static async createWord(data: CreateWordRequest): Promise<ApiResponse<Word>> {
    return apiClient.post<Word>('/v1/words', data)
  }

  // Update word
  static async updateWord(id: string, data: UpdateWordRequest): Promise<ApiResponse<Word>> {
    return apiClient.put<Word>(`/v1/words/${id}`, data)
  }

  // Delete word
  static async deleteWord(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/v1/words/${id}`)
  }
}