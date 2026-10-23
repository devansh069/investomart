import { env } from '../../config/env';
import type { ApiEnvelope, ApiErrorBody } from './types';

const REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: ApiErrorBody,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  accessToken?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiEnvelope<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  try {
    const response = await fetch(`${env.apiBaseUrl}/${path.replace(/^\//, '')}`, {
      method: options.method ?? 'GET',
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      headers,
      signal: controller.signal,
    });

    const payload = (await response.json()) as ApiEnvelope<T> | ApiErrorBody;

    if (!response.ok || !payload.success) {
      const errorBody = payload as ApiErrorBody;
      throw new ApiError(errorBody.message || 'The request failed.', response.status, errorBody);
    }

    return payload as ApiEnvelope<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('The request timed out.', 408);
    }

    throw new ApiError('Unable to reach the InvestorMart service.', 0);
  } finally {
    clearTimeout(timeout);
  }
}
