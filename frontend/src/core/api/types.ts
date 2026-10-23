export interface ApiMeta {
  requestId?: string;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: ApiMeta;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
