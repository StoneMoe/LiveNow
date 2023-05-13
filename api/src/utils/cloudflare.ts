import { Env } from "../typing";

export interface CFAPIResp {
    success: boolean;
    errors: Array<any>;
    messages: Array<any>;
    result: any;
    [key: string]: any;
}

export default class Cloudflare {
    private readonly BASE_URL = 'https://api.cloudflare.com/client/v4';

    constructor(private readonly accountId: string, private readonly apiToken: string) { }

    static fromEnv(env: Env) {
        return new this(env.ACCOUNT_ID, env.API_TOKEN)
    }

    async _get(endpoint: string, params: Record<string, any> = {}): Promise<CFAPIResp> {
        const queryString = new URLSearchParams(params).toString();
        const url = `${this.BASE_URL}/${endpoint}?${queryString}`;
        const headers = {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch(url, { headers });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Request failed: ${errorMessage}`);
        }
        return response.json();
    }

    async _post(endpoint: string, data: Record<string, any>): Promise<CFAPIResp> {
        const url = `${this.BASE_URL}/${endpoint}`;
        const headers = {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Request failed: ${errorMessage}`);
        }
        return response.json();
    }

    async _put(endpoint: string, data: Record<string, any>): Promise<CFAPIResp> {
        const url = `${this.BASE_URL}/${endpoint}`;
        const headers = {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(data) });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Request failed: ${errorMessage}`);
        }
        return response.json();
    }

    async _delete(endpoint: string) {
        const url = `${this.BASE_URL}/${endpoint}`;
        const headers = {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch(url, { method: 'DELETE', headers });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Request failed: ${errorMessage}`);
        }
        return response.json();
    }

    async verify() {
        return this._get("user/tokens/verify");
    }

    async listLiveInput() {
        return this._get(`accounts/${this.accountId}/stream/live_inputs`);
    }

    async createLiveInput(ownerUsername: string, ownerId: number) {
        return this._post(`accounts/${this.accountId}/stream/live_inputs`, {
            "defaultCreator": ownerUsername,
            "meta": {
                "name": `livenow-${ownerUsername}(${ownerId})`
            },
            "recording": {
                "mode": "off",
            }
        });
    }
    async getLiveInput(liveUid: string) {
        return this._get(`accounts/${this.accountId}/stream/live_inputs/${liveUid}`);
    }
}
