interface RequestProps {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  responseType?:
    | "json"
    | "text"
    | "blob"
    | "formData"
    | "arraybuffer"
    | "stream";
  headers?: Record<string, string>;
}

class FetchService {
  private async request({ method, url, data, headers }: RequestProps) {
    try {
      const headersInit: HeadersInit = {
        ...headers,
      };

      if (!(data instanceof FormData)) {
        headersInit["Content-Type"] = "application/json";
      }

      const response = await fetch(url, {
        method,
        headers: headersInit,
        body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
        cache: method === "GET" ? "default" : "no-store",
      });

      if (process.env.NODE_ENV === "development") {
        console.log(`[FetchService] Response status:`, response.status);
      }

      const responseData =
        response.headers.get("Content-Type")?.includes("application/json") &&
        (await response.json());

      if (!response.ok) {
        const errorMessage =
          responseData?.message ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return {
        data: responseData,
      };
    } catch (error) {
      console.error(`[FetchService] Error:`, error);

      throw error;
    }
  }

  public async POST({ url, data, headers }: RequestProps) {
    return await this.request({ method: "POST", url, data, headers });
  }

  public async GET({ url, headers }: RequestProps) {
    return await this.request({ method: "GET", url, headers });
  }

  public async PUT({ url, data, headers }: RequestProps) {
    return await this.request({ method: "PUT", url, data, headers });
  }

  public async DELETE({ url, headers }: RequestProps) {
    return await this.request({ method: "DELETE", url, headers });
  }

  public async PATCH({ url, data, headers }: RequestProps) {
    return await this.request({ method: "PATCH", url, data, headers });
  }
}

const fetchService = new FetchService();

export default fetchService;
