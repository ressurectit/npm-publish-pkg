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
    constructor(private _args: IHelpObject)
    {
    }
    
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
}