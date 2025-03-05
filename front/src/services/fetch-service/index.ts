interface RequestProps<T = unknown> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: T;
  responseType?:
    | "json"
    | "text"
    | "blob"
    | "formData"
    | "arraybuffer"
    | "stream";
  headers?: Record<string, string>;
}

interface ReturnProps {
  data?: Promise<unknown>;
  message?: string;
}

class FetchService {
  private async request<T>({
    method,
    url,
    data,
    headers,
  }: RequestProps<T>): Promise<ReturnProps> {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return {
        data: response.bodyUsed ? response.json() : undefined,
      };
    } catch (error) {
      return {
        message: `Unexpected error: ${error}`,
      };
    }
  }

  public async POST<T>({ url, data, headers }: RequestProps<T>) {
    return await this.request({ method: "POST", url, data, headers });
  }

  public async GET({ url, headers }: RequestProps) {
    return await this.request({ method: "GET", url, headers });
  }

  public async PUT<T>({ url, data, headers }: RequestProps<T>) {
    return await this.request({ method: "PUT", url, data, headers });
  }

  public async DELETE({ url, headers }: RequestProps) {
    return await this.request({ method: "DELETE", url, headers });
  }

  public async PATCH<T>({ url, data, headers }: RequestProps<T>) {
    return await this.request({ method: "PATCH", url, data, headers });
  }
}

const fetchService = new FetchService();

export default fetchService;
