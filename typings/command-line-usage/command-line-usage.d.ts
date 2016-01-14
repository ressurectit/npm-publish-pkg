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

declare type TextBlock = string|string[]|Object[]|Object;

interface IUsageOptions
{
    header: TextBlock;
    title: string;
    description: TextBlock;
    synopsis: TextBlock;
    groups: Object;
    examples: TextBlock;
    footer: TextBlock;
    hide: string|string[]; 
}

declare module "command-line-usage" 
{
    interface ICommandLineUsageStatic
    {
        /**
         * Gets usage help as string
         * @param  {IOptionDefinition[]} definitions Definitions of options for command
         * @param  {IUsageOptions} options Options for displaying other info for command
         * @returns string
         */
        (definitions: IOptionDefinition[], options: IUsageOptions): string;
    }
    
    var _tmp: ICommandLineUsageStatic;
    export = _tmp;
}