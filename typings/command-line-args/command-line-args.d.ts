/// <reference path="../command-line-usage/command-line-usage.d.ts" />

declare module "command-line-args" 
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
         * @param  {any} options? TODO not finished this yet
         * @returns string
         */
        getUsage(options?: IUsageOptions): string;
    }
    
    interface ICommandLineArgsStatic
    {
        (definitions: IOptionDefinition[]): ICommandLineArgs;
    }
    
    var _tmp: ICommandLineArgsStatic;
    export = _tmp;
}