declare module 'chai-http' {
  import chaiHttp from 'chai-http';
  import * as chai from 'chai';
  import { Server } from 'http';

  chai.use(chaiHttp);

  interface ChaiHttpRequest {
    keepOpen(): this;
    close(callback: (err: any) => void): this;
  }

  interface ChaiHttpResponse {
    redirectURL: string;
  }

  interface Response extends ChaiHttpResponse, chai.Assertion { }

  export interface Agent {
    app: any;
    close(callback?: (err: any) => void): this;
    keepOpen(): this;
    get(path: string): ChaiHttpRequest;
    post(path: string): ChaiHttpRequest;
    put(path: string): ChaiHttpRequest;
    patch(path: string): ChaiHttpRequest;
    del(path: string): ChaiHttpRequest;
    options(path: string): ChaiHttpRequest;
    head(path: string): ChaiHttpRequest;
  }

  export interface ChaiHttp {
    (server: Server): Agent;
  }

  export const request: ChaiHttp;
  export const agent: (server: Server) => Agent;
  export function addPromises(p: any): void;
  export function patchRequest(chai: any): void;
  export function patchResponse(chai: any): void;

  export default chaiHttp;
}
