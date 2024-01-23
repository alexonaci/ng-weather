import { InjectionToken } from '@angular/core';

export const CACHE_CONFIG = new InjectionToken<CacheConfig<string>>('cacheConfig');

/*
 * The key is checked trough the generic type such that we can have
 * type checking based on the keys that we set in app module.
 * In this case NgWeatherResource.
 * Inside the cache services I set a more basic type CacheConfig<string> because
 * the module should not know the specific configuration of the application.
 * In this way it is more reusable and could potentially be extracted as
 * a library.
 */
export type CacheConfig<R> = {
  resources: Resource<R>[];
};

export type Resource<R> = {
  name: R;
  cacheTime: number;
};
