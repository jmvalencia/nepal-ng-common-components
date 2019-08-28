# Al Multi Select With Chips

This is an enhanced version of the original multiselect from primeng. Includes details for the options
and chips with tooltips.

<img src="https://algithub.pd.alertlogic.net/storage/user/280/files/1d08106e-c8ee-11e9-92a3-405f83f98537" width="500"/>

## Requires

Requires **SelectItem** interface from prime:

```typescript
import {SelectItem} from 'primeng/api';
```

## Usage

Full mode:

```html
<al-multiselect-chips [defaultLabel]="'Change the label here'" [field]="'optionalFieldToDisplayForChips'" [options]="yourOptions" (onSelectedOption)="selectOption($event)"></al-multiselect-chips>
```

Simplest mode:

```html
<al-multiselect-chips [options]="yourOptions"></al-multiselect-chips>
```

## Displaying Details

Multiselect uses the **SelectItem** interface from **primeng/api** if you want to specify details just
add a "details" field to the value object:

Specify "details":

```typescript
    {
        label: "John Whick",
        value: { // The value object that could contain anything.
            anyValue: "1",
            anyOtherValue: "Any value!"
            details: "jshonwhick@mydetails.com" // Details that will be displayed at bottom.
        }
    }
```

<img src="https://algithub.pd.alertlogic.net/storage/user/280/files/01538e64-c8e6-11e9-9b00-7aa82b1ea44f" width="600"/>

## Defining a field for the chips

Using the field attribute you can specify a different field to show in the Chip label, if you don´t specify this field "label" will be used in place:

Use "name" as the field to display in the chips:

```html
    <al-multiselect-chips [field]="'name'" [options]="multiSelectWithChipsItems"></al-multiselect-chips>
```

<img src="https://algithub.pd.alertlogic.net/storage/user/280/files/1046394e-c8e6-11e9-88fd-a0ad9bb8ef4a" width="600"/>

## Selected Options

To grab the selected options you can bind a listener to the "onSelectedOption" every time the user select or delete a chip:

```html
    <al-multiselect-chips [options]="multiSelectWithChipsItems" (onSelectedOption)="selectOption($event)"></al-multiselect-chips>
```
