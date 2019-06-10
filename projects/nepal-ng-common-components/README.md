  @al/ng-common-components
=========
### Component Library for Alert Logic Angular Applications

A ready made suite of Angular UI components for usage with NEPAL powered Alert Logic Angular applications

## Installation

`npm install @al/ng-common-components`

### Setup

Register the module in your Angular application

````
import { NepalNgCommonComponentsModule } from '@al/ng-common-components';

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NepalNgCommonComponentsModule
  ],
  providers: [
    ...
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
````
