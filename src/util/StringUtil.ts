
export class StringUtil {

    static camelToSnakeCase(str: string) {
        return str[0].toLowerCase() + 
            str.slice(1, str.length).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }

    static upperCamelToSnakeCase(str: string) {
        return this.splitUpperCamel(str, '_');
    }

    static splitUpperCamel(str: string, separator: string) {
        return str.replace(/[A-Z]/g, (letter, index) => {
            return index == 0 ? letter.toLowerCase() : separator + letter.toLowerCase();
        });
    }
}