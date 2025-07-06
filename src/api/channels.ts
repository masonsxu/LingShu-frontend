import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Your FastAPI backend URL

// --- TypeScript Interfaces mirroring Pydantic Models ---

export interface BaseConfig {
  type: string;
}

export interface HTTPSourceConfig extends BaseConfig {
  type: "http";
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
}

export interface TCPSourceConfig extends BaseConfig {
  type: "tcp";
  port: number;
  host?: string;
  use_mllp?: boolean;
}

export type SourceConfig = HTTPSourceConfig | TCPSourceConfig;

export interface PythonScriptFilterConfig extends BaseConfig {
  type: "python_script";
  script: string;
}

export type FilterConfig = PythonScriptFilterConfig;

export interface PythonScriptTransformerConfig extends BaseConfig {
  type: "python_script";
  script: string;
}

export type TransformerConfig = PythonScriptTransformerConfig;

export interface HTTPDestinationConfig extends BaseConfig {
  type: "http";
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: { [key: string]: string };
}

export interface TCPDestinationConfig extends BaseConfig {
  type: "tcp";
  host: string;
  port: number;
  use_mllp?: boolean;
}

export type DestinationConfig = HTTPDestinationConfig | TCPDestinationConfig;

export interface ChannelModel {
  id?: string;
  name: string;
  description?: string;
  enabled?: boolean;
  source: SourceConfig;
  filters?: FilterConfig[];
  transformers?: TransformerConfig[];
  destinations: DestinationConfig[];
}

// --- API Functions ---

export const getChannels = async (): Promise<ChannelModel[]> => {
  const response = await axios.get<ChannelModel[]>(`${API_BASE_URL}/channels/`);
  return response.data;
};

export const getChannelById = async (id: string): Promise<ChannelModel> => {
  const response = await axios.get<ChannelModel>(`${API_BASE_URL}/channels/${id}`);
  return response.data;
};

export const createChannel = async (channel: ChannelModel): Promise<ChannelModel> => {
  const response = await axios.post<ChannelModel>(`${API_BASE_URL}/channels/`, channel);
  return response.data;
};

export const updateChannel = async (id: string, channel: ChannelModel): Promise<ChannelModel> => {
  const response = await axios.put<ChannelModel>(`${API_BASE_URL}/channels/${id}`, channel);
  return response.data;
};

export const deleteChannel = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/channels/${id}`);
};

export interface MessageProcessRequest {
  message: string;
}

export interface MessageProcessResponse {
  success: boolean;
  result?: string;
  error?: string;
  processed_message?: string;
}

export const processMessage = async (id: string, request: MessageProcessRequest): Promise<MessageProcessResponse> => {
  const response = await axios.post<MessageProcessResponse>(`${API_BASE_URL}/channels/${id}/process`, request);
  return response.data;
};
