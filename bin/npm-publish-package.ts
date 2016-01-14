#!/usr/bin/env node
/*jshint esnext: true */

import {IHelpObject, processArguments, VersionManager} from "../index";

var args: IHelpObject = processArguments();
var versionManager: VersionManager = new VersionManager(args);

versionManager.TestPackageJsonExistance()
    .CheckVersionArgsConflict()
    .UpdateVersion();



