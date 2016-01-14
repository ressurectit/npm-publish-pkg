declare module "command-line-args" 
{
    interface ICommandLineArgs
    {
        (data: string): void;
    }
    
    var _tmp: ICommandLineArgs;
    export = _tmp;
}