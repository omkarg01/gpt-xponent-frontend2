import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service';
import { ApplicationService } from '../application.service';
import { MessageService } from 'primeng/api';
import { ApplicationMessage } from '../utils/messages.constants';

@Component({
  selector: 'app-manage-applications',
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.scss']
})
export class ManageApplicationsComponent implements OnInit, OnDestroy {
  templateText = ApplicationMessage.text;
  serachStr = ''
  outputFileUrl = '—';
  btnCopyText = 'Copy';
  btnCopyIconName = 'pi pi-copy';
  tableRows = 7;
  loading = true;
  isOutputSchemaDialogVisible = false;
  isShareLinkDialogVisible = false;
  config: any = {};
  applicationsData: any[] = []
  outputSchemaData: any = {};
  configSubscription = new Subscription();
  getConfigurationSubscription = new Subscription();
  getOutputSchemaSubscription = new Subscription();
  readApplicationsSubscription = new Subscription();
  deleteApplicationsSubscription = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly apiService: ApiService,
    private readonly applicationService: ApplicationService,
  ) {}

  ngOnInit(): void {
    this.checkForConfig()
    this.fetchApplicationsFromAPI();
  }

  checkForConfig = () => {
    this.configSubscription = this.applicationService.configSubject.subscribe(params => {
      this.config = params

      if (!Object.keys(this.config).length) {
        // if config obj is empty, make API call
        this.getConfigurationFromApi()
      }
    })
  }

  fetchApplicationsFromAPI = () => {
    this.readApplicationsSubscription =
      this.applicationService.readApplications().subscribe({
        next: (readApplicationsResponse: any) => {
          this.applicationsData = readApplicationsResponse?.data ?? [];
          this.loading = false;
        },
        error: (readApplicationsError: any) => {
          this.applicationsData = [];
          this.loading = false;

          console.log(
            'Something went wrong while fetching applications. ERROR -> ',
            readApplicationsError
          );
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.templateText.manage.error.getApplicationError
          });
        }
      })
  }

  getConfigurationFromApi = () => {
    this.getConfigurationSubscription =
      this.applicationService.getConfiguration().subscribe({
        next: (response) => {
          if (response) {
            this.applicationService.setConfigSubject(response)
          }
        },
        error: (err) => {
          console.log(
            'Something went wrong while fetching configurations. ERROR -> ',
            err
          )
        }
      })
  }

  searchItem = (e: any) => {
    this.serachStr = e.target.value;
  }

  createNew = () => {
    this.router.navigate(['/applications/create']);
  }

  getDateFormated = (utcdate: any) => {
    return this.apiService.getDateFormated(utcdate)
  }

  edit = (applicationId: any) => {
    const appId = applicationId?.$oid ?? '';

    if (appId) {
      this.router.navigate(['/applications/update', appId]);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong while editing the application.'
      });
    }
  }

  openOutputSchema = (applicationId: any) => {
    this.isOutputSchemaDialogVisible = true;

    const appId = applicationId?.$oid ?? '';

    if (appId) {
      this.getOutputSchemaSubscription =
        this.applicationService.getOutputSchema(appId).subscribe({
          next: (getOutputSchemaResponse: any) => {
            this.outputSchemaData = getOutputSchemaResponse?.data ?? {};
          },
          error: (getOutputSchemaError: any) => {
            console.log(
              'Something went wrong while fetching the output schema. ERROR -> ',
              getOutputSchemaError
            )
          }
        })
    }
  }

  onOutputSchemaHide = () => {
    this.outputSchemaData = {};
    this.outputFileUrl = '—';
  }

  openShareLinkDialog = (outputApiUrl: string) => {
    this.isShareLinkDialogVisible = true;
    this.outputFileUrl = outputApiUrl ?? '—';
  }

  onHideShareLinkDialog = () => {
    this.outputFileUrl = '—';
  }

  deleteApplication = (applicationId: any) => {
    this.deleteApplicationsSubscription =
      this.applicationService.deleteApplication(applicationId).subscribe({
        next: (deleteApplicationResponse: any) => {
          if (deleteApplicationResponse) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Application deleted successfully.'
            });
            // fetch applications again after deleting one application
            this.fetchApplicationsFromAPI();
          }
        },
        error: (deleteApplicationError: any) => {
          console.log(
            'Something went wrong while deleting the application. ERROR -> ',
            deleteApplicationError
          )
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong while deleting the application.'
          });
        }
    })
  }

  showCopiedMessage = () => {
    this.btnCopyText = 'Copied';
    this.btnCopyIconName = 'pi pi-check';

    setTimeout(() => {
      // change back after 1.5s
      this.btnCopyText = 'Copy';
      this.btnCopyIconName = 'pi pi-copy'
    }, 1500);
  }

  ngOnDestroy(): void {
    this.configSubscription.unsubscribe();
    this.getConfigurationSubscription.unsubscribe();
    this.getOutputSchemaSubscription.unsubscribe();
    this.readApplicationsSubscription.unsubscribe();
    this.deleteApplicationsSubscription.unsubscribe();
  }
}
