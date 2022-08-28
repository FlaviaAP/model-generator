import { FileUtil } from "../../util/FileUtil";
import { StringUtil } from "../../util/StringUtil";

export class JavaStringBootGenerator {

    private _packagePrefix: string = '';
    private _entityPath: string = '';
    private _enumPath: string = '';
    private _dtoPath: string = '';
    private _paginationDTOPath: string = '';
    private _mapperPath: string = '';
    private _repositoryPath: string = '';
    private _customRepositoryPath: string = '';
    private _customRepositoryImplPath: string = '';
    private _servicePath: string = '';
    private _serviceTestPath: string = '';
    private _resourceDirPath: string = '';

    constructor(
        projectName: string,
        private entityName: string,
        private entityIdType: string,
        private schema: string,
        private resourcePath: string,
        private hasPaginationDTO: boolean,
        private hasEntityEnum: boolean = false
    ) {
        this._setDirPaths(projectName)
    }

    private _setDirPaths(projectName: string) {
        let projectConfig = FileUtil.getProjectConfig(projectName);
        let projectDirPath = projectConfig.dirPath;

        this._packagePrefix = projectConfig.packageName;
        let packagePath = projectConfig.packageName.replace(/\./g, '/');

        let srcMainPath = `${projectDirPath}/src/main/java/${packagePath}`;
        let srcTestPath = `${projectDirPath}/src/test/java/${packagePath}`;

        let domainPath = `${srcMainPath}/domain`;

        this._entityPath         = `${domainPath}/entity/${this.entityName}.java`;
        this._dtoPath           = `${domainPath}/dto/${this.entityName}DTO.java`;
        this._mapperPath        = `${domainPath}/mapper/${this.entityName}Mapper.java`;
        this._repositoryPath    = `${domainPath}/repository/${this.entityName}Repository.java`;

        if(this.hasPaginationDTO) {
            this._paginationDTOPath         = `${domainPath}/dto/pagination/${this.entityName}PaginationDTO.java`;
            this._customRepositoryPath      = `${domainPath}/repository/custom/Custom${this.entityName}Repository.java`;
            this._customRepositoryImplPath  = `${domainPath}/repository/custom/Custom${this.entityName}RepositoryImpl.java`;
        }

        if(this.hasEntityEnum) {
            this._enumPath = `${srcMainPath}/enumeration/${this.entityName}Enum.java`;
        }
        
        this._servicePath     = `${srcMainPath}/services/${this.entityName}Service.java`;
        this._serviceTestPath = `${srcTestPath}/services/${this.entityName}ServiceTest.java`;

        this._resourceDirPath = `${srcMainPath}/resources/${this.entityName}Resource.java`;
    }

    generateAll() {
        this._generateEntityFile();
        this._generateRepositoryFiles();
        this._generateDTOFile();
        this._generateMapperFile();
        this._generateEnumFile();
        this._generateServiceFile();
        this._generateServiceTestFile();
        this._generateResourceFile();
    }

    private _generateEntityFile() {
        let tableName = StringUtil.upperCamelToSnakeCase(this.entityName);

        if(FileUtil.exists(this._entityPath)) {
            return;
        }

        FileUtil.write(this._entityPath, 
            this._getFileContent('/domain/Entity.txt')
                .replace(/SCHEMA/g, this.schema)
                .replace(/TABLE_NAME/g, tableName)
        );
    }

    private _generateEnumFile() {
        if(this.hasEntityEnum) {
            this._generateFile(this._enumPath, '/domain/Enum.txt');
        }        
    }

    private _generateDTOFile() {
        this._generateFile(this._dtoPath, '/domain/dto/DTO.txt');
    }

    private _generateRepositoryFiles() {
        if(!this.hasPaginationDTO) {
            this._generateFile(this._repositoryPath, '/domain/repository/RepositorySimple.txt');
            return;
        }

        this._generateFile(this._paginationDTOPath, '/domain/dto/PaginationDTO.txt');
        this._generateFile(this._customRepositoryPath, '/domain/repository/CustomRepository.txt');
        this._generateFile(this._customRepositoryImplPath, '/domain/repository/CustomRepositoryImpl.txt');
        this._generateFile(this._repositoryPath, '/domain/repository/Repository.txt');
    }

    private _generateMapperFile() {
        this._generateFile(this._mapperPath, '/domain/Mapper.txt');
    }

    private _generateServiceFile() {
        this._generateFile(this._servicePath, '/services/Service.txt');
    }

    private _generateServiceTestFile() {
        this._generateFile(this._serviceTestPath, '/services/ServiceTest.txt');
    }

    private _generateResourceFile() {
        if(FileUtil.exists(this._resourceDirPath)) {
            return;
        }

        FileUtil.write(this._resourceDirPath, 
            this._getFileContent('/resources/Resource.txt')
                .replace(/RESOURCE_PATH/g, this.resourcePath)
        );
    }

    private _generateFile(targetPath: string, templateRelativePath: string) {
        if(FileUtil.exists(targetPath)) {
            return;
        }

        FileUtil.write(targetPath, 
            this._getFileContent(templateRelativePath)
        );
    }

    private _getFileContent(templateRelativePath: string) {
        let fullPath = FileUtil.srcDirPath + '/src/backend/spring-boot/templates' +  templateRelativePath;
        return FileUtil.read(fullPath)
            .replace(/PACKAGE_PREFIX/g, this._packagePrefix)
            .replace(/ENTITY_NAME/g, this.entityName)
            .replace(/ID_TYPE/g, this.entityIdType)
    }

}