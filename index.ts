import * as commandLineArgs from "command-line-args";
import * as fs from "fs";
import * as childProcess from "child_process";

export interface IHelpObject
{
    help?: boolean;
    registry?: string;
    pre?: boolean;
    buildNumber?: boolean;
    majorNumber?: boolean;
    specificVersion?: string;
    targetTag?: string;
}

export function processArguments(): IHelpObject
{
    var cli = commandLineArgs(
    [
        { name: "help", alias: "h", type: Boolean, description: "Displays help for this command line tool." },
        { name: "registry", alias: "r", type: String, description: "Npm registry (repository) url address.", typeLabel: "<url>" },
        { name: "pre", alias: "p", type: Boolean, description: "Indication that version should be set to prerelease version." },
        { name: "buildNumber", alias: "b", type: Boolean, description: "Indicates that build number of version should be incremented." },
        { name: "majorNumber", alias: "m", type: Boolean, description: "Indicates that major number of version should be incremented." },
        { name: "specificVersion", alias: "v", type: String, description: "Specific version that is going to be set. If this is set overrides any other version parameter.", typeLabel: "<version>" },
        { name: "targetTag", alias: "t", type: String, description: "Tag that will be assigned to published package. If not specified 'latest' is used for normal version and 'pre' is used for prerelease version.", typeLabel: "<tag>" }
    ]);

    var args: IHelpObject = <IHelpObject>cli.parse();

    if(args.help)
    {
        console.log(cli.getUsage(
        {
            title: "npm-publish-package (npp)",
            description: "Application used for publishing packages into npm repository, with auto version increment.",
            examples: 
            [
                {
                    example: "> npp",
                    description: 'Deploys package to npm default repository and increases minor version number. i.e. 1.1.2 => 1.2.0 with tag "latest"'
                },
                {
                    example: '> npp -r "http://registryUrl"',
                    description: 'Deploys package to npm "http://registryUrl" repository and increases minor version number. i.e. 1.1.2 => 1.2.0  with tag "latest"'
                },
                {
                    example: '> npp -p',
                    description: 'Deploys package to npm default repository and sets version as prerelease version. i.e. 1.1.2 => 1.2.0-pre123123123  with tag "pre"'
                },
                {
                    example: '> npp -p -b',
                    description: 'Deploys package to npm default repository and sets version as prerelease version. i.e. 1.1.2 => 1.1.3-pre123123123  with tag "pre"'
                },
                {
                    example: '> npp -b',
                    description: 'Deploys package to npm default repository and increments build version number. i.e. 1.1.0 => 1.1.1  with tag "latest"'
                },
                {
                    example: '> npp -m',
                    description: 'Deploys package to npm default repository and increments major version number. i.e. 1.1.0 => 2.0.0  with tag "latest"'
                },
                {
                    example: '> npp -v "3.0.0"',
                    description: 'Deploys package to npm default repository and sets specific version. i.e. 1.1.0 => 3.0.0  with tag "latest"'
                },
                {
                    example: '> npp -t "beta"',
                    description: 'Deploys package to npm default repository and increases minor version number. i.e. 1.1.2 => 1.2.0 with tag "beta"'
                }
            ]
        }));
    
        process.exit();
    }
    
    return args;
}

export function publishPackage(args: IHelpObject): void
{
    var command: string = "npm publish";
    
    if(args.registry)
    {
        command += ` --registry ${args.registry}`;
    }
    
    if(args.targetTag || args.pre)
    {
        if(args.targetTag)
        {
            command += ` --tag ${args.targetTag}`;
        }
        else
        {
            command += ` --tag "pre"`;
        }
    }
    
    childProcess.execSync(command);
}

export class VersionManager
{
    //fields
    private _originalVersion: string;
    private _content: string;
    private _majorVersion: number;
    private _minorVersion: number;
    private _buildVersion: number;
    private _preVersion: boolean;
    
    // private properties
    private get VersionRegex(): RegExp
    {
        return /"version":\s?"(\d+)\.(\d+)\.(\d+)(-\w+)?"/g;
    }
    
    // constructor
    constructor(private _args: IHelpObject)
    {
    }
    
    // public methods
    TestPackageJsonExistance(): VersionManager
    {
        try 
        {
            if(!fs.statSync("package.json").isFile())
            {
                console.error("'package.json' is not a file!");
                
                process.exit();
            }
        } catch (error) 
        {
            console.error(`There is no package.json in current directory. Original ${error}`);
            
            process.exit(1);
        }
        
        return this;
    }
    
    CheckVersionArgsConflict(): VersionManager
    {
        if(this._args.majorNumber && this._args.buildNumber)
        {
            console.error("You can not specify both parameters -b and -m!");
            
            process.exit(1);
        }
        
        return this;
    }
    
    UpdateVersion(): VersionManager
    {
        this.ReadFile();
        this.ComputeVersion();
        this.WriteFile(this._args.specificVersion);
        
        return this;
    }
    
    UndoVersion(): VersionManager
    {
        this.WriteFile(this._originalVersion);
        
        return this;
    }
    
    // private methods
    private ComputeVersion(): void
    {
        if((this._args.pre && this._preVersion) || (!this._args.pre && this._preVersion))
        {
            return;
        }
        
        if(this._args.buildNumber)
        {
            this._buildVersion++;
        }
        else if(this._args.majorNumber)
        {
            this._majorVersion++;
            this._minorVersion = 0;
            this._buildVersion = 0;
        }
        else
        {
            this._minorVersion++;
            this._buildVersion = 0;
        }
    }
    
    private ReadFile(): void
    {
        try
        {
            this._content = fs.readFileSync("package.json", 'utf8');
        }
        catch(error)
        {
            console.error(`Unexpected error occured! Original ${error}`);
            
            process.exit(1);
        }
        
        if(!this.VersionRegex.test(this._content))
        {
            console.error(`Unable to obtain version from package.json, probably bad syntax. Should be: "version": "1.0.0"`);
            
            process.exit(1);
        }
        
        try
        {
            var match: RegExpExecArray = this.VersionRegex.exec(this._content);
            
            this._majorVersion = parseInt(match[1]);
            this._minorVersion = parseInt(match[2]);
            this._buildVersion = parseInt(match[3]);
            this._preVersion = !!match[4];
            
            this._originalVersion = `${match[1]}.${match[2]}.${match[3]}`;
            
            if(this._preVersion)
            {
                this._originalVersion += match[4];
            }
        }
        catch(error)
        {
            console.error(`Unable to parse version number! Original ${error}`);
            
            process.exit(1);
        }
    }
    
    private WriteFile(versionOverride?: string): void
    {
        var version: string = versionOverride;
        
        if(!versionOverride)
        {
            if(this._args.pre)
            {
                var timestamp: number = Math.floor(new Date().getTime() / 1000); 
                version = `${this._majorVersion}.${this._minorVersion}.${this._buildVersion}-pre${timestamp}`;
            }
            else
            {
                version = `${this._majorVersion}.${this._minorVersion}.${this._buildVersion}`;
            }
        }
        
        var result: string = this._content.replace(this.VersionRegex, `"version": "${version}"`);

        try
        {
            fs.writeFileSync("package.json", result, 'utf8');
        }
        catch(error)
        {
            console.error(`Unexpected error occured! Original ${error}`);
            
            process.exit(1);
        }
    }
}