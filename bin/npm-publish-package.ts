#!/usr/bin/env node
/*jshint esnext: true */

import {IHelpObject, processArguments} from "../index";

var args: IHelpObject = processArguments();

console.log(args);


