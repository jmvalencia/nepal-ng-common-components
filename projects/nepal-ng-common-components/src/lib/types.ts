/*
 * @author Stephen Jones <stephen.jones@alertlogic.com>
 * @copyright Alert Logic, Inc 2019
 *
 */

/*
 *  Proportional widget width.  Widget width is controlled by its container.  This proportional
 *  width determines how many cells on the X axis a widget will take up
 */
export enum WidgetWidth {
  W1 = 1,
  W2,
  W3,
  W4,
}

/*
 *  Proportional widget height.  Widget height is controlled by its container.  This proportional
 *  height determines how many cells on the Y axis a widget will take up
 */
export enum WidgetHeight {
  H1 = 1,
  H2,
  H3,
  H4,
}

/*
 *  Used to emit which Widget Button was clicked
 */
export enum WidgetClickType {
  Settings,
  Primary,
  Link1,
  Link2,
}

/*
 *
 */
export enum WidgetContentType {
  Column,
  Word,
  SemiCircle,
  Count,
  TreeMap,
  TableListSummary,
  ActivityGauge,
  Bar,
  Area,
}


/*
 * Zero state reason for not displaying a chart
 */
export enum ZeroStateReason {
  API,
  Entitlement,
  Zero
}

/*
 *
 */
export interface ZeroState {
  nodata: boolean;
  reason: ZeroStateReason;
}


/*
 * Widget content - can be anything such as a chart, grid, number etc
 */
export interface WidgetContent {
  type: WidgetContentType;
  data?: any;
}

/*
 * Height, Width and Position metrics for a UI widget
 */
export interface WidgetMetrics {
  height: WidgetHeight;
  width: WidgetWidth;
  position?: number;
}

/*
 * UI only - component configuration
 */
export interface Widget {
  id: string;
  title: string;
  hideSettings?: boolean;
  content?: WidgetContent;
  metrics: WidgetMetrics;
  actions?: {
    primary?: {
      name: string,
      action?: WidgetButtonAction;
    };
    link1?: string;
    link2?: string;
    settings?: string;
  };
}

export interface WidgetButtonAction {
  target_app?: string;
  path?: string;
  url?: string;
}

/**
 *
 */
export interface TableListHeader {
    name: string;
    field: string;
    class?: string;
    style?: string;
}

/**
 *
 */
export interface TableListBody {
    summary: string;
    count?: string|number;
    deployment?: string;
    status?: string;
    country?: string;
    /**
     * Define the type of table, used for styling
     */
    type?: string;
}

export interface TableListConfig {
    headers: TableListHeader[];
    body: TableListBody[];
}

/*
 * AlHighchartsActivityGaugeComponent Interface
 *
 * @value {number} - %age value (0-100)
 * @title {string} - optional title
 * @text1 {string} - upper text shown in centre of chart
 * @text2 {string} - lower text shown in centre of chart
 * @color {string} - optional color of bar
 * @backgroundColor {string} - optional backgroundColor of bar
 */
export interface ActivityGaugeConfig {
    value: number;
    text1: string;
    text2: string;
    title?: string;
    className?: string;
    backgroundColor?: string;
}

