/**
 * List item details
 */
export interface ObjectDetails {
     id: number|string;
     name: string;
     code: number|string;
}

/**
 * Dashboard list items
 */
export interface ObjectValue {
    label: string;
    icon?: string;
    value?: ObjectDetails[];
}
