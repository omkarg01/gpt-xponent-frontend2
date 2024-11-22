export class ApplicationMessage {
  public static readonly text = {
    create: {
      datasource: "This Field is required",
      loader: {
        messageTop: 'Please wait while we test the files.',
        messageBottom: 'This process can take couple of minutes ...'
      },
    },
    manage: {
      template: {

      },
      error: {
        getApplicationError: 'Something went wrong while fetching applications.'
      }
    },
    update: [
      { datasource: "This Field is required" }
    ],
    delete: [

    ],
    edit:
      []
  }
}