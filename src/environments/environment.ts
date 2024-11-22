// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiendpoint: "https://exponentiasmartsearch-dev.azurewebsites.net/",
  // apiendpoint: "https://exponentiasmartsearch.azurewebsites.net/",
  containerName: "gptxponent-dev",
  sas: "?si=gptxponent-dev&spr=https&sv=2022-11-02&sr=c&sig=OtuRy1wgWK6n%2B2E4MyFmH5prdqd75O9FbQAkVcFWdUY%3D",
  chatContainerName: "local-data",
  bloburl:"https://adlsgen2gptxponentmeta.blob.core.windows.net",
  morePptListIndex:'6',
  maslClientID:'44bbec44-ec70-46dc-a615-97b8820b2cab',
  msalRedirectionUrl:'http://localhost:4200/',
  graphAPIUrl:"https://graph.microsoft.com/beta/",
  folderName: 'ppt-data',
  categoryFolderName: 'category-csv-data',
  testingInstructionsFolder: 'application-instruction-test',
  accessSyncInterval:3600000 //3600000  //every hour // 60000 every minute
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
