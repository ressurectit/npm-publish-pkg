import * as commandLineArgs from "command-line-args";
import * as fs from "fs";
import * as childProcess from "child_process";
import * as semver from "semver";

export interface IHelpObject
{
    help?: boolean;
    registry?: string;
    pre?: boolean;
    buildNumber?: boolean;
    majorNumber?: boolean;
    specificVersion?: string;
    targetTag?: string;
    preReleaseSuffix?: string;
    dryRun?: boolean;
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
        { name: "targetTag", alias: "t", type: String, description: "Tag that will be assigned to published package. If not specified 'latest' is used for normal version and 'pre' is used for prerelease version.", typeLabel: "<tag>" },
        { name: "preReleaseSuffix", alias: "s", type: String, description: "Suffix that will be added to version number. If not specified 'pre' is used. It is not used without 'pre' parameter.", defaultValue: "pre", typeLabel: "<suffix>"},
        { name: "dryRun", alias: "d", type: Boolean, description: "Runs script as dry run. Displaying expected version and expected command for publising"}
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
                    description: 'Deploys package to npm default repository and sets version as prerelease version. i.e. 1.1.2 => 1.2.0-pre.0  with tag "pre"'
                },
                {
                    example: '> npp -p -b',
                    description: 'Deploys package to npm default repository and sets version as prerelease version. i.e. 1.1.2 => 1.1.3-pre.0  with tag "pre"'
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
                    example: '> npp -t "stable"',
                    description: 'Deploys package to npm default repository and increases minor version number. i.e. 1.1.2 => 1.2.0 with tag "stable"'
                },
                {
                    example: '> npp -p -s "beta"',
                    description: 'Deploys package to npm default repository and increases minor version number and uses "beta" version suffix. i.e. 1.1.2 => 1.2.0-beta.0  with tag "pre"'
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
    
    console.log(`Publishing command is '${command}'`);
    
    if(args.dryRun)
    {
        return;
    }
    
    childProcess.execSync(command);
}

export class VersionManager
{
    //######################### private fields #########################
    private _originalVersion: string;
    private _content: string;
    private _version: string;
    private _preVersion: boolean;
    
    //######################### private properties #########################
    private get VersionRegex(): RegExp
    {
        return /"version":\s?"(\d+\.\d+\.\d+(-(?:\w|\.)+)?)"/g;
    }
    
    //######################### constructor #########################
    constructor(private _args: IHelpObject)
    {
    }
    
    //######################### public methods #########################
    TestPackageJsonExistance(): VersionManager
    {
        try 
        {
            if(!fs.statSync("package.json").isFile())
            {
                console.error("'package.json' is not a file!");
                
                process.exit(1);
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
    
    //######################### private methods #########################
    private ComputeVersion(): void
    {
        if(this._args.pre && this._preVersion)
        {
            this._version = semver.inc(this._version, "pre", this._args.preReleaseSuffix)
            
            return;
        }
        
        var identifier: string = "";
        
        if(this._args.pre)
        {
            identifier = "pre";
        }
        
        if(this._args.buildNumber)
        {
            identifier += "patch";
        }
        else if(this._args.majorNumber)
        {
            identifier += "major";
        }
        else
        {
            identifier += "minor";
        }
        
        this._version = semver.inc(this._version, identifier, this._args.preReleaseSuffix)
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
            
            this._originalVersion = this._version = match[1];
            this._preVersion = !!match[2];
            
            if(!semver.valid(this._version))
            {
                console.error(`Provided version '${this._version}' is not valid according semver specification.`);
                
                process.exit(1);
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
            version = this._version;
        }
        
        console.log(`Next version will be ${version}`);
        
        if(this._args.dryRun)
        {
            return;
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