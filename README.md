  NEPAL NG Common Components
=========
### Component Library for Alert Logic Angular Applications

A ready made suite of Angular UI components for usage with NEPAL powered Alert Logic Angular applications

Built using [PrimeNG](https://www.primefaces.org/primeng)

## Getting stared

`npm install`

`npm run start`

Go to http://localhost:4300 to view the usage guide application where example component usage can be found

## Building

The `npm run build` command will package up the nepal-ng-common-components library application into a generated `dist` folder.


## Packaging

`npm run package`

Performs a build and then packages into a `.tgz` file named according to the library application name and version number, e.g al-nepal-ng-common-components-0.1.0.tgz

IMPORTANT - Be sure to increment the version number for the library application, so under `projects/nepal-ng-common-components/package.json` following SEMVER

## Publishing

After packaging the library as per the section above, from the `dist/nepal-ng-common-components` run the `npm publish` command with a parameter containing the name of the versioned `.tgz` file you want to publish, e.g.

`npm publish al-nepal-ng-common-components-0.1.0.tgz`

## Development

### Adding New Components

When adding new components, these must be placed in the nepal-ng-common-components library project under `src/lib`.

These need to be added to the `components.ts` file where they will get registered and exported in the nepal-ng-common-components module automatically.

### Sample Application (Usage Guide)

When adding any new components to the main library, you should showcase examples of the component in use in the usgae guide application with appropriate code samples.

#### Important Notes

When adding further PrimeNG modules to the `PrimeNGModule` in the nepal-ng-common-components project application, you may find you get a warning when you next run the build command.

For example:
```
No name was provided for external module 'primeng/menu' in output.globals – guessing 'menu'
```
During the build process by ng-packagr under the hood, when bundling into UMD format it will assign names to external modules it comes across. Internally, ng-packagr has common names registered for popular frameworks but PrimeNG is not yet in this list.

We can instead add a name to be used in the `ng-package.json` file to the `umdModuleIds` object like so:
```
"primeng/menu" : "primeng/menu"
```
This provides ng-packagr a name to use rather than trying to guess one which could perhaps cause problems down the line with possible name conflicts

### Local Development

Use `npm link` from the `dist/nepal-ng-common-components` directory and then link to this from any other Angular project directory.

