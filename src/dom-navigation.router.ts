import {BaseElement, ComponentConfig} from "@ayu-sh-kr/dota-core";
import {NavigationOption, RenderConfig, RouteConfig, RouterService} from "@dota/Types";
import 'reflect-metadata';
import {RouterUtils} from "@dota/RouterUtils";

export class DomNavigationRouter<T extends BaseElement> implements RouterService<T> {

  public readonly routes: RouteConfig<T>[]
  public readonly errorRoute: RouteConfig<T>;
  public readonly defaultRoute: RouteConfig<T>;

  constructor(
    routes: RouteConfig<T>[],
    errorRoute: RouteConfig<T>,
    defaultRoute: RouteConfig<T>,
  ) {
    this.routes = routes;
    this.errorRoute = errorRoute;
    this.defaultRoute = defaultRoute;
    this.init();

    // handle initial navigation
    const url = new URL(window.location.href);
    this.render({
      router: this,
      routes: this.routes,
      options: {},
      path: url.pathname
    });
  }

  init() {
    const navigation: Navigation = window.navigation;
    navigation.addEventListener('navigate', (event: NavigateEvent) => {
      if (!event.canIntercept || event.hashChange || event.downloadRequest !== null) {
        return;
      }

      const url = new URL(event.destination.url);
      const routes = this.routes;
      const router = this;
      let render = this.render;
      event.intercept({
        async handler() {
          render({
            path: url.pathname,
            routes: routes,
            router: router
          });
        }
      })
    })
  }

  /**
   * Find a route configuration based on the given path.
   * This method searches for an exact match first, and if not found, it checks for partial matches.
   * If a match is found, it returns the corresponding route configuration.
   *
   * @param path - The path to search for.
   * @param routes - The array of route configurations to search in.
   * @returns The matching route configuration or undefined if no match is found.
   */
  private static findRoute<T extends BaseElement>(path: string, routes: RouteConfig<T>[]): RouteConfig<T> | undefined {
    console.info(`Searching route for path: ${path}`);
    // First, try to find an exact match
    const exactMatch = routes.find(route => route.path === path);
    if (exactMatch && exactMatch.render) return exactMatch
    else if (exactMatch) return DomNavigationRouter.findRoute(RouterUtils.getChildPath(path, exactMatch), routes);

    for (const route of routes) {
      if (path.startsWith(route.path) && route.children && route.children.length > 0) {
        if (route.render) {
          return route;
        }
        const childPath = RouterUtils.getChildPath(path, route);
        const childRoute = DomNavigationRouter.findRoute(childPath, route.children);

        if (childRoute) {
          return childRoute;
        }

        return route;
      }
    }

    return undefined;
  }

  render(config: RenderConfig<T>): void {
    const {path, routes, options} = config;
    const router = config.router as DomNavigationRouter<T>;
    if (path === '/error') {
      if (Reflect.hasOwnMetadata('Component', router.errorRoute.component)) {
        const config: ComponentConfig = Reflect.getOwnMetadata('Component', router.errorRoute.component);
        const previousPath = RouterUtils.getPreviousPath();
        document.querySelector('#app-root')!.innerHTML = `
            <${config.selector} path="${previousPath}" message="${options?.message || 'Path not found'}"></${config.selector}>
        `;
        return;
      }
      console.error(`Error route component not found for path: ${path}`);
    }

    const route = DomNavigationRouter.findRoute(path, routes);
    if (!route) {
      console.warn(`Route not found for path: ${path}`);
      window.navigation.navigate('/error');
      return;
    }

    if (route.render) {
      console.info(`Rendering route with custom render function for path: ${path}`);
      route.render(path);
      return;
    }

    if (Reflect.hasOwnMetadata('Component', route.component)) {
      const config: ComponentConfig = Reflect.getOwnMetadata('Component', route.component);
      document.querySelector('#app-root')!.innerHTML = `<${config.selector} path="${path}"></${config.selector}>`;
      return;
    }

    console.error(`Component not found for path: ${path}`);
  }

  /**
   * Navigate to a specified path using the Navigation API.
   * This method is responsible for navigating to a new path using the Navigation API.
   * It ensures that the path starts with a slash and creates a navigation destination object.
   * Finally, it triggers the navigation using the Navigation API.
   *
   * @param path - The path to navigate to.
   * @param options - Optional navigation options.
   * @returns void
   */
  static route(path: string, options?: NavigationOption): void {
    // Make sure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Create a navigation destination object
    const navigationDestination = {
      url: new URL(normalizedPath, window.location.origin).toString()
    };

    // Trigger navigation using the Navigation API
    window.navigation.navigate(path);
  }
}