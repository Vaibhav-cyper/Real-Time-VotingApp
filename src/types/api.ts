/**
 * TypeScript interfaces for API responses and vote data
 */

export interface VoteData {
  A: number;
  B: number;
  C: number;
}

export interface VoteResult {
  votes: VoteData;
  total: number;
  percentages: {
    A: number;
    B: number;
    C: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  name: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

export interface VoteRequest {
  option: string;
}

export interface VoteResponse {
  success: boolean;
  message?: string;
}

export interface VotesResponse {
  votes: VoteData;
  total: number;
  percentages: {
    A: number;
    B: number;
    C: number;
  };
}

export interface SessionResponse {
  valid: boolean;
  hasVoted: boolean;
  userName: string;
}

export type VoteOption = 'A' | 'B' | 'C';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}