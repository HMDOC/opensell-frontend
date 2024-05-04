export function getLanguage(language: number, data: any): any {
    switch (language) {
        case 1: return data.fr;
        default: return data.en;
    }
}