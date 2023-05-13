export class PasswordUtil {
    static async encrypt(plainText: string): Promise<string> {
        const encoder = new TextEncoder()
        const salt = crypto.getRandomValues(new Uint8Array(16))
        const data = encoder.encode(`${plainText}${salt}`)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
        const saltHex = Array.from(new Uint8Array(salt))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
        return `${saltHex}:${hashHex}`
    }

    static async verify(plainText: string, cipherText: string): Promise<boolean> {
        const [saltHex, hashHex] = cipherText.split(':')
        const encoder = new TextEncoder()
        const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
        const data = encoder.encode(`${plainText}${salt}`)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHexCalculated = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
        return hashHex === hashHexCalculated
    }
}
