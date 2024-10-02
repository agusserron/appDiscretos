// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//const baseIP = "http://172.28.110.33:3005";
const baseIP = "http://localhost:3005";

export const environment = {
  production: false,
  apiAuth: `${baseIP}/gateway/auth`,
  apiAire: `${baseIP}/gateway/microservice_aire`,
  apiAgua: `${baseIP}/gateway/microservice_agua`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
