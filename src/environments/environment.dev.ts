export const environment = {
  production: true,
  apiendpoint: "https://exponentiasmartsearch-dev.azurewebsites.net/",
  containerName: "gptxponent-dev",
  sas: "?si=gptxponent-dev&spr=https&sv=2022-11-02&sr=c&sig=OtuRy1wgWK6n%2B2E4MyFmH5prdqd75O9FbQAkVcFWdUY%3D",
  chatContainerName: "local-data",
  bloburl:"https://adlsgen2gptxponentmeta.blob.core.windows.net",
  morePptListIndex:'6',
  maslClientID:'44bbec44-ec70-46dc-a615-97b8820b2cab',
  msalRedirectionUrl:'https://aixponent-dev.exponentia.ai/',
  graphAPIUrl:"https://graph.microsoft.com/beta/",
  folderName: 'ppt-data',
  testingInstructionsFolder: 'application-instruction-test',
  categoryFolderName: 'category-csv-data',
  accessSyncInterval:3600000 //3600000  //every hour // 60000 every minute
};
