/// <reference path="../command-line-usage/command-line-usage.d.ts" />

declare module CommandLineArgsModule
{
    interface ICommandLineArgs
    {
        /**
         * Returns an object containing all the values and flags set on the command line. By default it parses the global process.argv array.
         * @param  {string[]} argv? An array of strings, which if passed will be parsed instead of process.argv.
         * @returns Object
         */
        parse(argv?: string[]): Object;
        
        /**
         * Generates a usage guide.
         * @param  {CommandLineUsageModule.IUsageOptions} options? Options used for displaying help 
         * @returns string
         */
        getUsage(options?: CommandLineUsageModule.IUsageOptions): string;
    }
    
    interface ICommandLineArgsStatic
    {
        /**
         * Constructs command line parsing object
         * @param  {CommandLineUsageModule.IOptionDefinition[]} definitions Definitions that represents args from command line
         * @returns ICommandLineArgs
         */
        (definitions: CommandLineUsageModule.IOptionDefinition[]): ICommandLineArgs;
    }
}

declare module "command-line-args"
{
    var _tmp: CommandLineArgsModule.ICommandLineArgsStatic;
    export = _tmp;
}