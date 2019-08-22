import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef,Renderer2,HostListener, OnChanges} from '@angular/core';
import { AIMSAccount } from '@al/aims';
import { ALSession } from '@al/session';
import { SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { AlNavigationService } from '../../services';

@Component({
    selector:       'al-archipeligo17-account-selector',
    templateUrl:    './al-archipeligo17-account-selector.component.html',
    styleUrls:      ['./al-archipeligo17-account-selector.component.scss']
})

export class AlArchipeligo17AccountSelectorComponent implements OnInit
{
    /**
     * Account list data and account which is curently active.
     */
    @Input() accountList: AIMSAccount[] = [];
    @Input() activeAccountName:string;
    @Input() activeAccountID: string;

    /**
     * Account selection event
     */
    @Output() accountSelection: EventEmitter<AIMSAccount> = new EventEmitter();

    @ViewChild(Dropdown) dropdown: Dropdown;

    primaryAccountId: string;
    accountListView: AIMSAccount[] = [];
    filteredAccountList: AIMSAccount[] = [];

    /**
     * Flags.
     */
    expanded: boolean = false;
    lastSearch: string = '';

    /**
     * Default view variables.
     */
    viewDefaults = {
        millisecondsToCloseAfterClickOutside : 500 // Magic number that solves when the user click out side and the menu is "disappearing" this give time to mat-menu to close.
    };

    item: AIMSAccount;
    scrollHeight = '480px';

    constructor(private elRef: ElementRef) { }

    ngOnInit() {
        this.primaryAccountId = ALSession.getPrimaryAccountId();
    }

    /**
     * When the user clicks outside of the input and lost the focus
     * it is a mouse leave too.
     */
    focusOutFunction(event) {
        setTimeout(() => {
            this.collapseMenu(event);
        },this.viewDefaults.millisecondsToCloseAfterClickOutside);
    }

    /**
     * When the user change an account.
     */
    onChange( $event ) {
        if($event.value && $event.originalEvent && $event.originalEvent.which === 1){
            this.sendAccount(<AIMSAccount>$event.value);
        }
    }

    sendAccount(account) {
        if(!account.isEmpty){
            this.accountSelection.emit(account);
        }
    }

    /**
     * Receives userInput from search bar component and uses to filter
     * account tiles.
     */
    onSearchChanged( $event ) {
        this.lastSearch = $event.target.value;
        this.filterAccounts();
    }

    /**
     * Filter the account list by name and id based on the search.
     */
    filterAccounts() {
        this.dropdown.filterBy = "label,value.id";
        this.dropdown.filterValue = this.lastSearch;
        this.dropdown.emptyFilterMessage = "No accounts matched your search.";
        this.dropdown.activateFilter();
        if(this.dropdown.optionsToDisplay && this.dropdown.optionsToDisplay.length === 0){
            this.dropdown.optionsToDisplay = [{
                label: 'No accounts matched your search.',
                value: {
                    isEmpty: true
                }
            }];
        }
        this.resizeDropdown();
    }

    resizeDropdown() {
        if(this.dropdown.optionsToDisplay){
            let height = this.dropdown.optionsToDisplay.length >= 10 ? 480 : 48 * this.dropdown.optionsToDisplay.length;
            this.scrollHeight = height + 'px';
        }
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownEscapeHandler(evt: KeyboardEvent) {
        if (this.expanded) {
            this.focusOutFunction(evt);
        }
     }

    @HostListener('document:keydown.enter', ['$event']) onKeydownEnterHandler(evt: KeyboardEvent) {
        if(this.dropdown && this.dropdown.selectedOption) {
            this.sendAccount(<AIMSAccount>this.dropdown.selectedOption.value);
            this.collapseMenu(evt);
        }
    }

    /**
     * Expands the menu and disable the scrolling on the page.
     */
    expandMenu($event) {
        this.sortAccounts();
        this.expanded = true;
        setTimeout(() => {
            this.dropdown.focus();
            this.dropdown.show();
            this.resizeDropdown();
        });
        if (this.elRef && this.elRef.nativeElement && this.elRef.nativeElement.ownerDocument.body) {
            this.elRef.nativeElement.ownerDocument.body.style.overflow = 'hidden';
        }
    }

    /**
     * Collapse the menu and return the scrolling to the page.
     */
    collapseMenu($event) {
        this.expanded = false;
        this.clearFilter($event);
        // Return the scrolling to the page.
        if (this.elRef && this.elRef.nativeElement && this.elRef.nativeElement.ownerDocument.body) {
            this.elRef.nativeElement.ownerDocument.body.style.overflow = 'auto';
        }
    }

    /**
     * Execute the sort of the accounts and then show the result
     * in the view.
     */
    sortAccounts() {
        this.accountList = this.accountList.sort(( a, b ) => {
            if ( a.name > b.name ) {
                return 1;
            }
            if ( a.name < b.name ) {
                return -1;
            }
            return 0;
        });
    }

    clearFilter($event) {
        if(this.dropdown) {
            this.dropdown.clear($event);
        }
    }
}
