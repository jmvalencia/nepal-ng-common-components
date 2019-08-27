import { Component, OnInit } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { CountryService } from '../../../service/countryservice';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AlToastMessage } from 'projects/nepal-ng-common-components/src/lib/al-toast/types';
import { AlToastService } from 'projects/nepal-ng-common-components/src/lib/al-toast/al-toast.service';

@Component({
  selector: 'app-form-examples',
  templateUrl: './form-examples.component.html',
  styleUrls: ['./form-examples.component.scss']
})
export class FormExamplesComponent implements OnInit {
  country: any;

  filteredCountries: any[];

  brands: string[] = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'];

  filteredBrands: any[];

  selectedBrands: string[];

  yesterday: Date = new Date();

  carOptions: SelectItem[];

  selectedMultiSelectCars: string[] = [];

  cities: SelectItem[];

  citiesListbox: SelectItem[];

  selectedCity1: any;

  selectedCity2: any;

  ratingValue: number;

  checkboxValues: string[] = [];

  radioValues: string[];

  switchChecked: boolean;

  rangeValues: number[] = [20, 80];

  toggleButtonChecked: boolean;

  types: SelectItem[];

  splitButtonItems: MenuItem[];

  radioValue: string;

  selectedType: string;

  color: string;

  multiSelectWithChipsItems:SelectItem[] = [];

  constructor(private breadcrumbService: BreadcrumbService,
    private alToastService: AlToastService) {
    this.breadcrumbService.setItems([
      { label: 'Base Components' },
      { label: 'Forms', routerLink: ['/form-examples'] }
    ]);
    this.alToastService.getButtonEmitter('myToast').subscribe(
      (button) => {
        this.alToastService.clearMessages('myToast');
      }
    );
  }

  ngOnInit() {
    this.carOptions = [];
    this.carOptions.push({ label: 'Audi', value: 'Audi' });
    this.carOptions.push({ label: 'BMW', value: 'BMW' });
    this.carOptions.push({ label: 'Fiat', value: 'Fiat' });
    this.carOptions.push({ label: 'Ford', value: 'Ford' });
    this.carOptions.push({ label: 'Honda', value: 'Honda' });
    this.carOptions.push({ label: 'Jaguar', value: 'Jaguar' });
    this.carOptions.push({ label: 'Mercedes', value: 'Mercedes' });
    this.carOptions.push({ label: 'Renault', value: 'Renault' });
    this.carOptions.push({ label: 'VW', value: 'VW' });
    this.carOptions.push({ label: 'Volvo', value: 'Volvo' });

    this.cities = [];
    this.cities.push({ label: 'Select City', value: 0 });
    this.cities.push({ label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } });
    this.cities.push({ label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } });
    this.cities.push({ label: 'London', value: { id: 3, name: 'London', code: 'LDN' } });
    this.cities.push({ label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } });
    this.cities.push({ label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } });

    this.citiesListbox = this.cities.slice(1);

    this.types = [];
    this.types.push({ label: 'Apartment', value: 'Apartment' });
    this.types.push({ label: 'House', value: 'House' });
    this.types.push({ label: 'Studio', value: 'Studio' });

    this.splitButtonItems = [
      { label: 'Update', icon: 'ui-icon-update' },
      { label: 'Delete', icon: 'ui-icon-close' },
      { label: 'Home', icon: 'ui-icon-home', url: 'http://www.primefaces.org/primeng' }
    ];

    this.multiSelectWithChipsItems = [
      {
        label: "John Whick",
        value: {
            id: "1",
            name: "Mr. John Whick in Chip" // Specify the field for the chip
        }
      },
      {
        label: "Steven Castro",
        value: {
            id: "2",
            name: "Mr. Steven Castro in Chip",
            details: "detailsfor@stevencastro.com" // Example of item with details.
        }
      },
      {
        label: "Peter Smith",
        value: {
            id: "3",
            name: "Mr. Peter Smith in Chip" // Specify the field for the chip
        }
      }
    ];
  }

  filterCountry(event) {
    // const query = event.query;
    // this.countryService.getCountries().then(countries => {
    //     this.filteredCountries = this.searchCountry(query, countries);
    // });
  }

  searchCountry(query, countries: any[]): any[] {
    // in a real application, make a request to a remote url with the query and return filtered results,
    // for demo we filter at client side
    const filtered: any[] = [];
    for (const country of countries) {
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(country);
      }
    }
    return filtered;
  }

  filterBrands(event) {
    this.filteredBrands = [];
    for (const brand of this.brands) {
      if (brand.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredBrands.push(brand);
      }
    }
  }

  selectedOptionsEvent (event:any) {
    console.log("Multiselect with chips on selected options event example!",event);
  }

  handleACDropdownClick(event: Event) {
    this.filteredBrands = [];

    // mimic remote call
    setTimeout(() => {
      this.filteredBrands = this.brands;
    }, 100);
  }

  showAlToast(key: string) {
    switch (key) {
      case 'custom':
        const alToastMessage: AlToastMessage = {
          sticky: true,
          closable: false,
          data: {
            title: 'This is the title',
            message: 'This is a test message, here you can put whatever you want, choose wisely your words',
            iconClass: 'pi-exclamation-triangle',
            buttons: [
              {
                key: 'dont-show',
                label: 'don\'t show this message again',
                class: 'p-col secondaryButton',
                textAlign: 'left'
              },
              {
                key: 'close',
                label: 'not right now',
                class: 'p-col-fixed',
                textAlign: 'right'
              },
              {
                key: 'upgrade',
                label: 'hell yeah!',
                class: 'p-col-fixed',
                textAlign: 'right'
              }
            ]
          }
        };
        this.alToastService.showMessage('myToast', alToastMessage);
        break;
    }
  }

  clearAlToast() {
    this.alToastService.clearMessages('myToast');
  }
}
