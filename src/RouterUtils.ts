import {RouteConfig} from "@dota/Types";
import {BaseElement} from "@ayu-sh-kr/dota-core";

export class RouterUtils {

  /**
   * Get the previous path from the navigation entries.
   * This method retrieves the previous path from the navigation entries using the Navigation API.
   * It checks if there are more than one entry and returns the pathname of the second-to-last entry.
   *
   * @returns The previous path as a string or an empty string if not found.
   */
  static getPreviousPath(): string {
    const navigation = window.navigation;
    const entries = navigation.entries();
    if (entries.length > 1) {
      return new URL(entries[entries.length - 2].url || '').pathname;
    }
    return '';
  }

  /**
   * Get the current path from the navigation entries.
   * This method retrieves the current path from the navigation entries using the Navigation API.
   * It checks if there are any entries and returns the pathname of the last entry.
   *
   * @returns The current path as a string or an empty string if not found.
   */
  static getCurrentPath(): string {
    const navigation = window.navigation;
    const entries = navigation.entries();
    if (entries.length > 0) {
      return new URL(entries[entries.length - 1].url || '').pathname;
    }
    return '';
  }

  /**
   * Get the child path from the given path and route configuration.
   * This method extracts the child path from the given path based on the route configuration.
   * It checks if the path starts with the route's path and returns the remaining part of the path.
   *
   * @param path - The path to extract the child path from.
   * @param route - The route configuration to check against.
   * @returns The child path as a string or '/' if not found.
   */
  static getChildPath<T extends BaseElement>(path: string, route: RouteConfig<T>) {
    return path.substring(route.path.length) || '/';
  }

}