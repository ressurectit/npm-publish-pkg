declare module "command-line-args" 
{
    interface IOptionDefinition
    {
        /**
         * Name of argument in command line
         */
        name: string;
        type?: Function;
        alias?: string;
        multiple?: boolean;
        defaultOption?: boolean;
        defaultValue?: any;
        group?: string|string[];
        description?: string;
        typeLabel?: string;
    }
    
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
        getUsage(options?: any): string;
    }
    
    interface ICommandLineArgsStatic
    {
        (definitions: IOptionDefinition[]): ICommandLineArgs;
    }
    
    var _tmp: ICommandLineArgsStatic;
    export = _tmp;
}