#!/usr/bin/env node
/*jshint esnext: true */

import {IHelpObject, processArguments, VersionManager, publishPackage} from "../index";

var args: IHelpObject = processArguments();
var versionManager: VersionManager = new VersionManager(args);

versionManager.TestPackageJsonExistance()
    .CheckVersionArgsConflict()
    .UpdateVersion();

try
{
    publishPackage(args);
}
catch(error)
{
    console.error(`Problem with publishing! Original ${error}`);
    
    versionManager.UndoVersion();
}
