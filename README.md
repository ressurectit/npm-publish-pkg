# npm-publish-package
Script for publishing npm to Nexus repository

##Version 1.1.0 

####Help will be done later

####Command line usage

After global installation (with proper configuration of npm registry):
...
npm install -g npm-publish-package 
...
you can use following to display help:
...
npp -h
...

...
npm-publish-package (npp)

  Application used for publishing packages into npm repository, with auto version increment.

Options

  -h, --help                        Displays help for this command line tool.
  -r, --registry <url>              Displays help for this command line tool.
  -p, --pre                         Indication that version should be set to prerelease version.
  -b, --buildNumber                 Indicates that build number of version should be incremented.
  -m, --majorNumber                 Indicates that major number of version should be incremented.
  -n, --noRegistry                  Indicates that npm publish will be called without registry argument.
  -v, --specificVersion <version>   Specific version that is going to be set. If this is set overrides any other
                                    version parameter.

Examples

  > npp                           Deploys package to npm default repository and increases minor version number. i.e. 1.1.2 => 1.2.0
  > npp -r "http://registryUrl"   Deploys package to npm "http://registryUrl" repository and increases minor version number. i.e. 1.1.2 => 1.2.0
  > npp -n                        Deploys package to npm repository set in package.json and increases minor version number or error will occur. i.e. 1.1.2 => 1.2.0
  > npp -p                        Deploys package to npm default repository and sets version as prerelease version. i.e. 1.1.2 => 1.2.0-pre123123123
  > npp -p -b                     Deploys package to npm default repository and sets version as prerelease version. i.e. 1.1.2 => 1.1.3-pre123123123
  > npp -b                        Deploys package to npm default repository and increments build version number. i.e. 1.1.0 => 1.1.1
  > npp -m                        Deploys package to npm default repository and increments major version number. i.e. 1.1.0 => 2.0.0
  > npp -v "3.0.0"                Deploys package to npm default repository and sets specific version. i.e. 1.1.0 => 3.0.0
... 

