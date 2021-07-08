/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProjectTypes } from './types';

/*
 * Some keys in NameOptions impact the app more than other.
 * While some are just a tech stack, some choices are crucial for what type of app it will be, like:
 * 1. STATE_MANAGEMENT # the global state of the app
 * 2. ROUTING # the routing (pages to be included),
 *    if no routing is included, just add an App.{ext} file with some components.
 */
export enum NameOptions {
  APP_TYPE = 'appType',
  LANGUAGE = 'language',
  ESLINT = 'eslint',
  STATE_MANAGEMENT = 'stateManagement', // Impacts the app
  CSS_PROCESSOR = 'css-processor',
  TESTING = 'testing',
  ROUTING = 'routing', // Impacts the app
  HISTORY_ROUTER = 'historyRouter',
  ESLINT_TYPE = 'eslintType',
  UI_FRAMEWORK = 'UiFramework',
  INCLUDE_DOCKER = 'includeDocker'
}

export enum AppTypes {
  SPA = 'SPA',
  SSR = 'SSR'
}

export enum Languages {
  JAVASCRIPT = 'JavaScript',
  TYPESCRIPT = 'TypeScript'
}

export enum CssPreProcessor {
  SASS = 'Sass/SCSS',
  LESS = 'Less',
  NONE = 'None, (normal css)'
}

export enum Testing {
  UNIT = 'Unit (jest)',
  E2E = 'E2E (cypress)'
}

export enum ESLint {
  AIRBNB = 'Airbnb',
  STANDARD = 'Standard'
}

export enum ReactUiFrameWorks {
  SEMANTIC_UI = 'Semantic UI',
  NONE = 'none'
}

export enum VueUiFrameWorks {
  VUETIFY = 'Vuetify',
  NONE = 'none'
}

export interface RoutesData {
  name: string,
}

export type Routes = Record<string, string|RoutesData>
export type States = Record<string, string|GlobalState>

export interface GlobalState {
  name: string,
  state: Record<string, any>,
  dispatchables: Array<string> | 'all'
}

/*
 * @interface
 * Interface for what data is included in the generated JSON file.
 */
export interface CompleteData {
  framework: ProjectTypes.REACT|ProjectTypes.VUE,
  canOverWriteApp: boolean, // can still modify and add on top though.
  routes?: Routes,
  globalState?: States,
}
