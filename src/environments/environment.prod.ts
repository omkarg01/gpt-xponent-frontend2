export const environment = {
  production: true,
  apiendpoint: "https://aixponent-backend.azurewebsites.net/",
  containerName: "gptxponent-prod",
  sas: "?si=Prod_SAS&spr=https&sv=2022-11-02&sr=c&sig=sIBRr81SeWesRVfNkpTg6z%2FpcrK8bGShYJFmM43DVss%3D",
  chatContainerName: "local-data",
  bloburl:"https://adlsgen2gptxponentmeta.blob.core.windows.net",
  morePptListIndex:'6',
  maslClientID:'44bbec44-ec70-46dc-a615-97b8820b2cab',
  msalRedirectionUrl:'https://aixponent.exponentia.ai/',
  graphAPIUrl:"https://graph.microsoft.com/beta/",
  folderName: 'ppt-data',
  testingInstructionsFolder: 'application-instruction-test',
  categoryFolderName: 'category-csv-data',
  accessSyncInterval:3600000 //3600000  //every hour // 60000 every minute
};
