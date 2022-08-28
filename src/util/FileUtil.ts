import * as fs from 'fs';
import * as pathLib from 'path';

const PROJECTS_CONFIG_PATH = '/src/projects.json';

export class FileUtil {

    static get srcDirPath() {
        return pathLib.resolve("./").replace(/\\/g, '/');
    }

    static getProjectConfig(projectName: string) {
        let path = this.srcDirPath + PROJECTS_CONFIG_PATH;
        return this.readJson(path)[projectName];
    }

    static readJson(path: string) {
        return JSON.parse(this.read(path));
    }

    static read(path: string): string {
        try {
            return fs.readFileSync(path, "utf8");
        } 
        catch (err) {
            console.log('Error at read file ' + path);
            throw err;
        }
    }

    static exists(path: string){
        return fs.existsSync(path);
    }

    static writeIfNonExist(path: string, content:string) {
        if(this.exists(path)) {
            console.log('Already exists ' + this._getFilename(path));
            return;
        }

        this.write(path, content);
    }

    static write(path: string, content:string) {
        try {
            fs.writeFileSync(path, content);
            console.log('Saved ' + this._getFilename(path));
        } 
        catch (err) {
            console.log('Error at write file ' + path);
            throw err;
        }
    }

    private static _getFilename(path: string) {
        return pathLib.basename(path);
    }
    
}