import { generateToken } from "../jwt-generator";
import fetch, { Headers, RequestInit, Response } from "node-fetch";
import { BASE_URL, BASE_URL_SANDBOX, USER_AGENT } from "../constants";
import { RequestOptions } from "./types/request-types";
import { handleException } from "./errors";

export class RESTBase {
  private apiKey: string | undefined;
  private apiSecret: string | undefined;
  private dry: boolean;

  constructor(key: string, secret: string, dry: boolean) {
    this.apiKey = key;
    this.apiSecret = secret;
    this.dry = dry;
  }

  request(options: RequestOptions): Promise<any> {
    const { method, endpoint, isPublic } = options;
    let { queryParams, bodyParams } = options;

    queryParams = queryParams ? this.filterParams(queryParams) : {};

    if (bodyParams !== undefined)
      bodyParams = bodyParams ? this.filterParams(bodyParams) : {};

    return this.prepareRequest(
      method,
      endpoint,
      queryParams,
      bodyParams,
      isPublic
    );
  }

  prepareRequest(
    httpMethod: string,
    urlPath: string,
    queryParams?: Record<string, any>,
    bodyParams?: Record<string, any>,
    isPublic?: boolean
  ) {
    const headers: Headers = this.setHeaders(httpMethod, urlPath, isPublic);

    const requestOptions: RequestInit = {
      method: httpMethod,
      headers: headers,
      body: JSON.stringify(bodyParams),
    };

    const queryString = this.buildQueryString(queryParams);
    const baseUrl = this.dry ? BASE_URL_SANDBOX : BASE_URL;
    const url = `https://${baseUrl}${urlPath}${queryString}`;

    return this.sendRequest(headers, requestOptions, url);
  }

  async sendRequest(
    headers: Headers,
    requestOptions: RequestInit,
    url: string
  ) {
    const response: Response = await fetch(url, requestOptions);
    const responseText = await response.text();
    handleException(response, responseText, response.statusText);

    return responseText;
  }

  setHeaders(httpMethod: string, urlPath: string, isPublic?: boolean) {
    const headers: Headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("User-Agent", USER_AGENT);
    if (this.dry) {
      headers.append("X-Sandbox", "true");
    }
    if (this.apiKey !== undefined && this.apiSecret !== undefined)
      headers.append(
        "Authorization",
        `Bearer ${generateToken(
          httpMethod,
          urlPath,
          this.apiKey,
          this.apiSecret
        )}`
      );
    else if (isPublic == undefined || isPublic == false)
      throw new Error(
        "Attempting to access authenticated endpoint with invalid API_KEY or API_SECRET."
      );

    return headers;
  }

  filterParams(data: Record<string, any>) {
    const filteredParams: Record<string, any> = {};

    for (const key in data) {
      if (data[key] !== undefined) {
        filteredParams[key] = data[key];
      }
    }

    return filteredParams;
  }

  buildQueryString(queryParams?: Record<string, any>): string {
    if (!queryParams || Object.keys(queryParams).length === 0) {
      return "";
    }

    const queryString = Object.entries(queryParams)
      .flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(
            (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
          );
        } else {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      })
      .join("&");

    return `?${queryString}`;
  }
}
