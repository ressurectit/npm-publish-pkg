#!/usr/bin/env node
/*jshint esnext: true */

import * as commandLineArgs from "command-line-args";

var cli = commandLineArgs(
[
    { name: "help", alias: "h", type: Boolean, description: "Displays help for this command line tool"}
]);

var args = cli.parse();

if(args.help === true)
{
    console.log(cli.getUsage());
}
