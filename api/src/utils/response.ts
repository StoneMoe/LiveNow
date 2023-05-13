export class APIBody {
    static ok<T>(data: T, message: string = ""): Response {
        const responseBody = JSON.stringify({ code: 0, data: data, msg: message });
        return new Response(responseBody, { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    static error(message: string | Error, code: number = 1, status: number = 200): Response {
        if (message instanceof Error) {
            message = (message.cause as Error)?.message || message.message
        }
        const responseBody = JSON.stringify({ code: code, data: null, msg: message });
        return new Response(responseBody, { status, headers: { 'Content-Type': 'application/json' } });
    }
}
