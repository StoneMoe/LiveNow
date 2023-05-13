import { Req } from '../typing'
import enUs from './en-us'
import zhCn from './zh-cn'

const locales = {
    'en-us': enUs,
    'zh-cn': zhCn
}

export default function i(req: Req, text: string) {
    const languageCodes =
        req.headers
            .get('accept-language')
            ?.split(',')
            .map((code) => code.split(';')[0].toLowerCase()) || []
    for (const code of languageCodes) {
        if (locales[code]) {
            return locales[code][text] || text
        }
    }
    return text
}
