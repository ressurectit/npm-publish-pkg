import * as commandLineArgs from "command-line-args";

export interface IHelpObject
{
    help: boolean;
}

export function processArguments(): IHelpObject
{
    var cli = commandLineArgs(
    [
        { name: "help", alias: "h", type: Boolean, description: "Displays help for this command line tool"}
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
                    description: "Deploys package to npm default repository and increases minor version number."
                },
                {
                    example: "> npm-publish-package",
                    description: "Deploys package to npm default repository and increases minor version number."
                }
            ]
        }));
    
        process.exit();
    }
    
    return args;
}

