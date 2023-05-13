import { IRequest, RequestLike } from "itty-router";

type Req = Request & IRequest & RequestLike;

interface Env {
	ACCOUNT_ID: string
	API_TOKEN: string
	JWT_KEY: string
	DB: D1Database
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket
}