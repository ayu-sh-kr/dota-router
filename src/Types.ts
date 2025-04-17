import {BaseElement} from "@ayu-sh-kr/dota-core";

/**
 * RouterService interface defines the methods that a router service should implement.
 * It includes an init method to initialize the router and a render method to render the appropriate component based on the current path.
 *
 * @template T - The type of the component that the router will render.
 */
export interface RouterService<T extends BaseElement> {

  /**
   * Initialize the router and set up event listeners for navigation events.
   * This method is called when the router is created.
   * It sets up the event listener for the 'navigate' event on the Navigation API.
   * The event listener intercepts navigation requests and renders the appropriate component based on the current path.
   *
   * @returns void
   */
  init(): void;

  /**
   * Render the component based on the current path and route configuration.
   * This method is responsible for rendering the appropriate component based on the current path.
   * It checks if the route has a custom render function or if it has a component associated with it.
   * If a component is found, it renders it in the app root element.
   *
   * @param config - The configuration object containing the path, routes, options, and router instance.
   * @returns void
   */
  render(config: RenderConfig<T>): void;
}

export type RouteConfig<T extends BaseElement> = {
  path: string;
  component: new () => T;
  default?: boolean;
  children?: RouteConfig<T>[];
  render?: (path: string) => void;
}

export type NavigationOption = {
  [key: string]: string;
}

export type RenderConfig<T extends BaseElement> = {
  path: string;
  routes: RouteConfig<T>[];
  options?: NavigationOption;
  router: RouterService<T>;
}