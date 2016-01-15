# npm-publish-package
Script for publishing npm to Nexus repository

##Version 1.1.0 

####Help will be done later

####Command line usage

After global installation (with proper configuration of npm registry):
`npm install -g npm-publish-package`
you can use following to display help:
`npp -h`

```
npm-publish-package (npp)

  Application used for publishing packages into npm repository, with auto version increment.

Options

  -h, --help                        Displays help for this command line tool.
  -r, --registry <url>              Npm registry (repository) url address.
  -p, --pre                         Indication that version should be set to prerelease version.
  -b, --buildNumber                 Indicates that build number of version should be incremented.
  -m, --majorNumber                 Indicates that major number of version should be incremented.
  -v, --specificVersion <version>   Specific version that is going to be set. If this is set overrides any other
                                    version parameter.
  -t, --targetTag <tag>             Tag that will be assigned to published package. If not specified 'latest' is
                                    used for normal version and 'pre' is used for prerelease version.

Examples

  > npp                           Deploys package to npm default repository and increases minor version number. i.e. 1.1.2 => 1.2.0 with tag "latest"
  > npp -r "http://registryUrl"   Deploys package to npm "http://registryUrl" repository and increases minor version number. i.e. 1.1.2 => 1.2.0 with tag "latest"
  > npp -p                        Deploys package to npm default repository and sets version as prerelease version. i.e. 1.1.2 => 1.2.0-pre123123123 with tag "pre"
  > npp -p -b                     Deploys package to npm default repository and sets version as prerelease version. i.e. 1.1.2 => 1.1.3-pre123123123 with tag "pre"
  > npp -b                        Deploys package to npm default repository and increments build version number. i.e. 1.1.0 => 1.1.1 with tag "latest"
  > npp -m                        Deploys package to npm default repository and increments major version number. i.e. 1.1.0 => 2.0.0 with tag "latest"
  > npp -v "3.0.0"                Deploys package to npm default repository and sets specific version. i.e. 1.1.0 => 3.0.0 with tag "latest"
  > npp -t "beta"                 Deploys package to npm default repository and increases minor version number. i.e. 1.1.2 => 1.2.0 with tag "beta"
``` 

