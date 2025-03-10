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
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        cache: "force-cache",
      });

      const responseData =
        response.headers.get("Content-Type")?.includes("application/json") &&
        (await response.json());

      if (!response.ok && responseData) {
        throw new Error(responseData.message);
      }

      return {
        data: responseData,
      };
    } catch (error) {
      if (error instanceof Error)
        return {
          message: error.message,
        };

      return {
        message: `Unexpected error: ${error}`,
      };
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
