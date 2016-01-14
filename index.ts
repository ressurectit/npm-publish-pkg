import * as commandLineArgs from "command-line-args";
import * as fs from "fs";

export interface IHelpObject
{
    help?: boolean;
    registry?: string;
    pre?: boolean;
    buildNumber?: boolean;
    majorNumber?: boolean;
    noRegistry?: boolean;
}

export function processArguments(): IHelpObject
{
    var cli = commandLineArgs(
    [
        { name: "help", alias: "h", type: Boolean, description: "Displays help for this command line tool." },
        { name: "registry", alias: "r", type: String, description: "Displays help for this command line tool.", defaultValue: "http://url", typeLabel: "<url>" },
        { name: "pre", alias: "p", type: Boolean, description: "Indication that version should be set to prerelease version." },
        { name: "buildNumber", alias: "b", type: Boolean, description: "Indicates that build number of version should be incremented." },
        { name: "majorNumber", alias: "m", type: Boolean, description: "Indicates that major number of version should be incremented." },
        { name: "noRegistry", alias: "n", type: Boolean, description: "Indicates that npm publish will be called without registry argument." }
    ]);

    var args: IHelpObject = <IHelpObject>cli.parse();

    if(args.help === true)
    {
        console.log(cli.getUsage(
        {
            title: "npm-publish-package",
            description: "Application used for publishing packages into npm repository, with auto version increment.",
            examples: 
            [
                {
                    example: "> npm-publish-package",
                    description: "Deploys package to npm default repository and increases minor version number. i.e. 1.1.2 => 1.2.0"
                },
                {
                    example: '> npm-publish-package -r "http://registryUrl"',
                    description: 'Deploys package to npm "http://registryUrl" repository and increases minor version number. i.e. 1.1.2 => 1.2.0'
                },
                {
                    example: '> npm-publish-package -n',
                    description: 'Deploys package to npm repository set in package.json and increases minor version number or error will occur. i.e. 1.1.2 => 1.2.0'
                },
                {
                    example: '> npm-publish-package -p',
                    description: 'Deploys package to npm default repository and sets version as prerelease version. i.e. 1.1.2 => 1.2.0-pre123123123'
                },
                {
                    example: '> npm-publish-package -p -b',
                    description: 'Deploys package to npm default repository and sets version as prerelease version. i.e. 1.1.2 => 1.1.3-pre123123123'
                },
                {
                    example: '> npm-publish-package -b',
                    description: 'Deploys package to npm default repository and increments build version number. i.e. 1.1.0 => 1.1.1'
                },
                {
                    example: '> npm-publish-package -m',
                    description: 'Deploys package to npm default repository and increments major version number. i.e. 1.1.0 => 2.0.0'
                },
            ]
        }));
    
        process.exit();
    }
    
    return args;
}

export class VersionManager
{
    //fields
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
        
        return this;
    }
    
    // private methods
    private ComputeVersion(): void
    {
        
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
        
        console.log(parseInt(this.VersionRegex.exec(this._content)[1]));
        try
        {
            var match: RegExpExecArray = this.VersionRegex.exec(this._content);
            
            this._majorVersion = parseInt(match[1]);
            this._minorVersion = parseInt(match[2]);
            this._buildVersion = parseInt(match[3]);
            this._preVersion = !!match[4];
            
            console.log(this);
        }
        catch(error)
        {
            console.error(`Unable to parse version number! Original ${error}`);
            
            process.exit(1);
        }
        
        
//         var result = data.replace(/string to be replaced/g, 'replacement');
// 
//         fs.writeFile(someFile, result, 'utf8', function (err) {
//         if (err) return console.log(err);
//         });
//         });
    }
    
    private WriteFile(): void
    {
        
    }
}