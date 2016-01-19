declare module CommandLineUsageModule
{
    interface IOptionDefinition
    {
        /**
         * Name of argument in command line
         */
        name: string;
        
        /**
         * Type functions argument (used as constructor) 
         */
        type?: Function;
        
        /**
         * Short name of argument in command line
         */
        alias?: string;
        
        /**
         * Indication that multiple occurencies of argument can be used in command line
         */
        multiple?: boolean;
        
        /**
         * Indication that argument represented by this definition can be used as default option (without parameter name)
         */
        defaultOption?: boolean;
        
        /**
         * Default value that is assigned to argument if not specified in command line
         */
        defaultValue?: any;
        
        /**
         * Used for grouping of arguments and represents name of group
         */
        group?: string|string[];
        
        /**
         * Description of argument used when displayed as help
         */
        description?: string;
        
        /**
         * Label for type of argument used when displayed as help
         */
        typeLabel?: string;
    }

    type TextBlock = string|string[]|Object[]|Object;

    interface IUsageOptions
    {
        header?: TextBlock;
        title?: string;
        description?: TextBlock;
        synopsis?: TextBlock;
        groups?: Object;
        examples?: TextBlock;
        footer?: TextBlock;
        hide?: string|string[]; 
    }
    
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
}

declare module "command-line-usage" 
{
    var _tmp: CommandLineUsageModule.ICommandLineUsageStatic;
    export = _tmp;
}