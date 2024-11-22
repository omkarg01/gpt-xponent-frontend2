import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../application.service';
import { CREATE_APPLICATION, DAYS_OF_WEEK, UPDATE_APPLICATION } from '../utils/constants';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ApplicationMessage } from '../utils/messages.constants';

@Component({
  selector: 'app-create-update-application',
  templateUrl: './create-update-application.component.html',
  styleUrls: [
    './create-update-application.component.scss',
    './create-update-application2.component.scss',
    './create-update-application3.component.scss'
  ]
})
export class CreateUpdateApplicationComponent implements OnInit, OnDestroy {
  currentApplicationId = null;
  pageTitle = 'Create Application';
  buttonName = 'Save Application';
  currentTimestampInISO = new Date().toISOString();
  templateText = ApplicationMessage.text;
  fullpageLoader = true;
  isInstructionsTesting = false;
  isSaveUpdateApplicationBtnDisabled = false;
  config: any = {};
  inputDataSources: any[] = [];
  frequencies: any[] = [];
  outputFormats: any[] = [];
  outputDestinations: any[] = [];
  allInputSites: any[] = []
  allOutputSites: any[] = []
  allInputFolders: any[] = []
  allOutputFolders: any[] = []
  filteredInputSites: any[] = [];
  filteredOutputSites: any[] = [];
  filteredInputFolders: any[] = [];
  filteredOutputFolders: any[] = [];
  inputFileFormats: any[] = [];
  days = DAYS_OF_WEEK;
  applicationForm: FormGroup = new FormGroup({})
  configSubscription = new Subscription()
  configurationSubscription = new Subscription()
  createApplicationSubscription = new Subscription()
  updateApplicationSubscription = new Subscription()
  testInstructionsSubscription = new Subscription()
  readApplicationSubscription = new Subscription()

  constructor (
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.checkForConfig();
    this.checkApplicationType();
    this.createApplicationForm();
  }

  get applicationIdGetter(): AbstractControl {
    return this.applicationForm.get('applicationId') as AbstractControl
  }

  get applicationNameGetter(): AbstractControl {
    return this.applicationForm.get('applicationName') as AbstractControl
  }

  get pipelinesGetter() {
    // type-casted as 'any' to avoid error in HTML template
    return this.applicationForm.get('pipelines') as any
  }

  get outputFormatGetter(): AbstractControl {
    return this.applicationForm.get('outputFormat') as AbstractControl
  }

  get outputDestinationGetter(): AbstractControl {
    return this.applicationForm.get('outputDestination') as AbstractControl
  }

  get outputSiteGetter(): AbstractControl {
    return this.applicationForm.get('outputSite') as AbstractControl
  }

  get outputFolderGetter(): AbstractControl {
    return this.applicationForm.get('outputFolder') as AbstractControl
  }

  checkForConfig = () => {
    this.configSubscription = this.applicationService.configSubject.subscribe(params => {
      this.config = params

      if (Object.keys(this.config).length) {
        // if config exists, patch it
        const {
          dataSource,
          frequencyList,
          inputFileFormats,
          outputFileFormats,
          siteData
        } = this.config;

        this.fullpageLoader = false;
        this.inputDataSources = dataSource || [];
        this.outputDestinations = dataSource || [];
        this.frequencies = frequencyList || [];
        this.inputFileFormats = inputFileFormats || [];
        this.outputFormats = outputFileFormats || [];
        this.allInputSites = siteData || [];
        this.allOutputSites = siteData || [];
        this.filteredInputSites = siteData || [];
        this.filteredOutputSites = siteData || [];
      } else {
        // if config does not exist, make API call
        this.getConfigurationFromApi();
      }
    })
  }

  getConfigurationFromApi = () => {
    this.configurationSubscription =
      this.applicationService.getConfiguration().subscribe({
      next: (response) => {
        if (response) {
          this.applicationService.setConfigSubject(response)
          const {
            dataSource,
            frequencyList,
            inputFileFormats,
            outputFileFormats,
            siteData
          } = response;

          this.fullpageLoader = false;
          this.inputDataSources = dataSource || [];
          this.outputDestinations = dataSource || [];
          this.frequencies = frequencyList;
          this.inputFileFormats = inputFileFormats || [];
          this.outputFormats = outputFileFormats || [];
          this.allInputSites = siteData || [];
          this.filteredInputSites = siteData || [];
          this.filteredOutputSites = siteData || [];
          
          this.getApplicationDataFromApi(this.currentApplicationId);
        }
      },
      error: (err) => {
        console.log(
          'Something went wrong while fetching configurations. ERROR -> ',
          err
        );
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong while fetching configurations.'
        });
      }
    })
  }

  getApplicationDataFromApi = (currentApplicationId: string | null) => {
    if (currentApplicationId) {
      this.readApplicationSubscription =
        this.applicationService.readApplication(currentApplicationId).subscribe({
        next: (readApplicationResponse: any) => {
          this.patchApplicationResponse(readApplicationResponse);
        },
        error: (readApplicationError: any) => {
          console.log(
            'Something went wrong while fetching application details. ERROR -> ',
            readApplicationError
          );
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong while fetching application details.'
          });
        }
      })
    }
  }

  patchApplicationResponse = (applicationData: any) => {
    const {
      application_id,
      application_name,
      output_destination,
      output_destination_details,
      output_format,
      pipelines
    } = applicationData;
    
    const pipelinesFormArray = this.pipelinesGetter as FormArray;

    const selectedOutputFormat = this.outputFormats.filter(outputFormat =>
      outputFormat?.key?.includes(output_format)
    )[0]

    const selectedOutputDestination = this.outputDestinations.filter(
      destination => destination?.key?.includes(output_destination)
    )[0];

    const selectedOutputSite = this.filteredOutputSites.filter(site =>
      site?.id?.includes(output_destination_details?.site_id)
    )[0];
    
    const selectedOutputFolder = selectedOutputSite?.folders?.filter(
      (folder: any) => folder.name?.includes(output_destination_details?.folder_name)
    )[0];

    this.applicationIdGetter?.patchValue(application_id ?? '');
    this.applicationNameGetter?.patchValue(application_name ?? '');
    this.outputFormatGetter?.patchValue(selectedOutputFormat ?? {});
    this.outputDestinationGetter?.patchValue(selectedOutputDestination ?? {});
    this.outputSiteGetter?.patchValue(selectedOutputSite ?? {});
    this.outputFolderGetter?.patchValue(selectedOutputFolder ?? {});
    this.allOutputFolders = selectedOutputSite?.folders ?? [];

    if (pipelines?.length) {
      pipelines?.forEach((pipeline: any, index: number) => {
        const {
          additional_information,
          created_at,
          created_by,
          databricksjobid,
          day,
          file_description,
          file_formats,
          frequency,
          instructions,
          last_run_at,
          modified_at,
          modified_by,
          pipeline_id,
          pipeline_name,
          source,
          source_details,
          time,
          updated
        } = pipeline;

        const selectedFrequency =
          this.frequencies.filter(freq => freq?.key?.includes(frequency))[0];

        const instructionsFormArray =
          pipelinesFormArray?.at(index)?.get('instructions') as FormArray
        instructionsFormArray?.removeAt(0) // remove default first empty element
        
        const outputSitesFoldersFormArray =
          pipelinesFormArray?.at(index)?.get('outputSitesFolders') as FormArray;
        outputSitesFoldersFormArray?.removeAt(0) // remove default first empty element

        const selectedInputDataSource = this.inputDataSources.filter(
          dataSource => dataSource?.key?.includes(source)
        )[0]

        const inputSitesFoldersFormArray =
          pipelinesFormArray?.at(index)?.get('inputSitesFolders') as FormArray;
        inputSitesFoldersFormArray?.removeAt(0) // remove default first empty element

        instructions.forEach((instruction: any) => {
          instructionsFormArray.push(this.formBuilder.group({
            title: instruction?.title ?? '',
            description: instruction?.description ?? ''
          }))
        })

        source_details?.forEach((sourceDetail: any) => {
          const selectedInputSite = this.filteredInputSites.filter(
            (inputSite: any) => inputSite?.id?.includes(sourceDetail?.site_id)
          )[0]

          const selectedInputFolder = selectedInputSite?.folders?.filter(
            (folder: any) => folder?.name?.includes(sourceDetail?.folder_name)
          )[0]

          inputSitesFoldersFormArray.push(this.formBuilder.group({
            inputSite: selectedInputSite ?? '',
            inputFolder: selectedInputFolder ?? '',
          }))
        })

        pipelinesFormArray.at(index).patchValue({
          additionalInformation: additional_information ?? [],
          createdAt: created_at ?? '',
          createdBy: created_by ?? '',
          databricksJobId: databricksjobid ?? '',
          day: day ?? '',
          fileDescription: file_description ?? '',
          inputFileFormats: file_formats ?? [],
          frequency: selectedFrequency ?? {},
          lastRunAt: last_run_at ?? '',
          modifiedAt: modified_at ?? '',
          modifiedBy: modified_by ?? '',
          pipelineId: pipeline_id?.$oid ?? null,
          pipelineName: pipeline_name ?? '',
          inputDataSource: selectedInputDataSource ?? {},
          time: time ?? '',
          updated: updated ?? false
        })
      })
    }
  }
  
  checkApplicationType = () => {
    // check whether application is getting CREATED or UPDATED
    this.activatedRoute.params.subscribe(params => {
      const { applicationId } = params;
  
      if (applicationId) {
        // for UPDATING application
        this.pageTitle = 'Update Application';
        this.buttonName = 'Update Application';
        this.currentApplicationId = applicationId ?? '';
        this.applicationService.setBreadcrumbSubject(UPDATE_APPLICATION)

        if (!this.fullpageLoader) {
          // make API call only if loader is not visible
          this.getApplicationDataFromApi(this.currentApplicationId);
        }
      } else {
        // for CREATING application
        this.pageTitle = 'Create Application';
        this.buttonName = 'Save Application';
        this.applicationService.setBreadcrumbSubject(CREATE_APPLICATION)
      }
    })
  }

  private createNewInputSitesFolders = (): FormGroup => {
    return this.formBuilder.group({
      inputSite: ['', Validators.required],
      inputFolder: ['', Validators.required],
      inputWebUrl: [''],
    })
  }

  private createNewInstruction = (): FormGroup => {
    return this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    })
  }

  private createNewPipeline = (): FormGroup => {
    return this.formBuilder.group({
      databricksJobId: [null],
      day: [''],
      time: [''],
      pipelineId: [null],
      pipelineName: ['', Validators.required],
      createdAt: [this.currentTimestampInISO],
      createdBy: [''],
      modifiedAt: [this.currentTimestampInISO],
      modifiedBy: [''],
      lastRunAt: [null],
      isPipelineTested: [false],
      inputDataSource: ['', Validators.required],
      inputSitesFolders: this.formBuilder.array([this.createNewInputSitesFolders()]),
      inputFileFormats: ['', Validators.required],
      fileDescription: [''],
      additionalInformation: [''],
      instructions: this.formBuilder.array([this.createNewInstruction()]),
      uploadedSampleFiles: [[]],
      testResults: [[]],
      frequency: ['', Validators.required],
      updated: [false],
      uploadedFiles: [[]],
    })
  }

  private refactorSourceDetails = (sourceDetails: any) => {
    return sourceDetails.map((sourceObj: any) => {
      return {
        "site_id": sourceObj?.inputSite?.id ?? null,
        "folder_name": sourceObj?.inputFolder?.name ?? null,
        "web_url": sourceObj?.inputFolder?.webUrl ?? null,
      }
    })
  }

  private refactorPipelineData = (pipelineData: any) => {
    const pipelinesFormArray = this.pipelinesGetter as FormArray;
    
    return pipelineData.map((pipelineData: any, index: number) => {
      const {
        additionalInformation,
        createdAt,
        createdBy,
        databricksJobId,
        day,
        fileDescription,
        frequency,
        inputDataSource,
        inputFileFormats,
        inputSitesFolders,
        instructions,
        lastRunAt,
        modifiedAt,
        modifiedBy,
        pipelineId,
        pipelineName,
        time,
      } = pipelineData;
      
      let isPipelineUpdated = false;

      if (this.currentApplicationId) {
        // change value of flag for UPDATING application
        isPipelineUpdated = !pipelinesFormArray?.controls?.at(index)?.pristine;
      }
      
      return {
        "additional_information": additionalInformation ?? [],
        "pipeline_id": pipelineId ?? null,
        "pipeline_name": pipelineName ?? null,
        "databricksjobid": databricksJobId ?? null,
        "source": inputDataSource?.key ?? null,
        "source_details": this.refactorSourceDetails(inputSitesFolders) ?? [],
        "file_description": fileDescription ?? null,
        "file_formats": inputFileFormats ?? [],
        "instructions": instructions ?? [],
        "frequency": frequency.key ?? null,
        "day": day ?? null,
        "time": time ?? null,
        "last_run_at": lastRunAt ?? null,
        "updated": isPipelineUpdated ?? false,
        "created_at": createdAt ?? null,
        "created_by": createdBy ?? null,
        "modified_at": modifiedAt ?? null,
        "modified_by": modifiedBy ?? null,
      }
    })
  }

  createApplicationForm = () => {
    this.applicationForm = this.formBuilder.group({
      applicationName: ['', Validators.required],
      applicationId: [''],
      outputFormat: ['', Validators.required],
      outputDestination: ['', Validators.required],
      outputSite: ['', Validators.required],
      outputFolder: ['', Validators.required],
      outputWebUrl: [''],
      pipelines: this.formBuilder.array([this.createNewPipeline()])
    })
  }

  filterInputSites = (event: any) => {
    const filteredSites: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.allInputSites.length; i++) {
      const site: any = this.allInputSites[i];
      if (site.name && site.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filteredSites.push(site);
      }
    }
    this.filteredInputSites = filteredSites;
  }

  selectInputSite = (value: any, siteFolder: FormGroup) => {
    this.allInputFolders = value.folders || [];
    this.filteredInputFolders = value.folders || [];
    siteFolder.controls['inputFolder'].reset()
  }

  filterInputFolders = (event: any) => {
    const filteredFolders: any[] = [];
    const query = event.query;

    for (let i = 0; i < this.allInputFolders.length; i++) {
      const folder: any = this.allInputFolders[i];
      if (folder.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filteredFolders.push(folder);
      }
    }
    this.filteredInputFolders = filteredFolders;
  }

  addNewInputSiteFolder = (index: number) => {
    const inputSitesFolders = this.pipelinesGetter.at(index).get('inputSitesFolders') as FormArray
    inputSitesFolders.push(this.createNewInputSitesFolders());
  }

  onFileDescriptionKeyUp = (event: any, index: number) => {
    const value = event?.target?.value ?? '';
    const additionalInformationControl =
      this.pipelinesGetter.at(index).get('additionalInformation') as AbstractControl
    
    if (value) {
      additionalInformationControl.setValidators([Validators.required]);
    } else {
      additionalInformationControl.setValidators([]);
    }

    additionalInformationControl.updateValueAndValidity();
  }

  deleteInputSiteFolder = (parentIndex: number, childIndex: number) => {
    const inputSitesFolders = this.pipelinesGetter.at(parentIndex).get('inputSitesFolders') as FormArray

    inputSitesFolders.removeAt(childIndex)
  }

  addNewInstruction = (index: number) => {
    const instructions = this.pipelinesGetter.at(index).get('instructions') as FormArray
    instructions.push(this.createNewInstruction());
  }

  deleteInstruction = (parentIndex: number, childIndex: number) => {
    const instructions = this.pipelinesGetter.at(parentIndex).get('instructions') as FormArray

    instructions.removeAt(childIndex)
  }

  testInstructions = (index: number) => {
    this.pipelinesGetter.at(index).get('isPipelineTested')?.setValue(true)
  }

  onSampleFilesUpload = (event: any, index: number) => {
    const fileList = event.target.files as FileList;
    let fileArray = Array.from(fileList);

    // Filter out files greater than 5 MB
    fileArray = fileArray.filter(file => {
      if (file?.size <= 5242880) {
        return true
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Uploaded file cannot be larger than 5 MB.'
        });
        return false
      }
    });
    
    const uploadedFilesControl = (this.pipelinesGetter as FormArray).at(index).get('uploadedFiles')

    uploadedFilesControl?.setValue([...uploadedFilesControl.value, ...fileArray])
  }

  filterOutputSites = (event: any) => {
    const filteredSites: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.allOutputSites.length; i++) {
      const site: any = this.allOutputSites[i];
      if (site.name && site.name.toLowerCase().includes(query.toLowerCase())) {
        filteredSites.push(site);
      }
    }
    this.filteredOutputSites = filteredSites;
  }

  filterOutputFolders = (event: any) => {
    const filteredFolders: any[] = [];
    const query = event.query;

    for (let i = 0; i < this.allOutputFolders.length; i++) {
      const folder: any = this.allOutputFolders[i];
      if (folder.name.toLowerCase().includes(query.toLowerCase())) {
        filteredFolders.push(folder);
      }
    }
    this.filteredOutputFolders = filteredFolders;
  }

  selectOutputSite = (value: any) => {
    this.allOutputFolders = value.folders || [];
    this.filteredOutputFolders = value.folders || [];
    this.outputFolderGetter.setValue('');
  }

  deleteUploadedSampleFile = (parentIndex: number, childIndex: number) => {
    const pipelinesFormArray = (this.pipelinesGetter as FormArray)
    const uploadedFilesControl = pipelinesFormArray.at(parentIndex)
    const uploadedFilesValue = uploadedFilesControl.value.uploadedFiles ?? []

    uploadedFilesControl.patchValue(uploadedFilesValue.splice(childIndex, 1))
  }

  testUploadedFiles = (index: number) => {
    const formData = new FormData();
    this.isInstructionsTesting = true;
    const uploadedFilesControl =
      (this.pipelinesGetter as FormArray).at(index).get('uploadedFiles')
    
    const instructionsControl =
      (this.pipelinesGetter as FormArray).at(index).get('instructions')
    
    const uploadedFilesValue = uploadedFilesControl?.value as File[]
    const instructionsValue = instructionsControl?.value
    const testData = JSON.stringify({
      "test_id": null,
      "instructions": instructionsValue
    })
    
    uploadedFilesValue.forEach(uploadedFile => {
      formData.append('files', uploadedFile)
    })
    formData.append('test_data', testData)

    this.testInstructionsSubscription =
    this.applicationService.testInstructions(formData).subscribe({
      next: (testInstructionsResponse: any) => {
        this.isInstructionsTesting = false;
        const testResults = testInstructionsResponse?.data ?? [];
        const testResultsControl =
        (this.pipelinesGetter as FormArray).at(index).get('testResults')
        
        testResultsControl?.patchValue(testResults)
      },
      error: (testInstructionsError: any) => {
        this.isInstructionsTesting = false;
        console.log(
          'Something went wrong while testing instructions. ERROR -> ',
          testInstructionsError
        );
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong while testing instructions.'
        });
      }
    })
  }

  addNewPipeline = () => {
    const pipelines = this.applicationForm.get('pipelines') as FormArray;
    pipelines.push(this.createNewPipeline());
  }

  confirmDeletePipeline = (event: any) => {
    // Stop the accordion from opening/closing
    event.stopPropagation();
  }

  deletePipeline = (index: number) => {
    const pipelines = this.pipelinesGetter as FormArray;
    pipelines.removeAt(index)
  }

  onFrequencyChange = (event: any, index: number) => {
    const { value } = event;
    const pipelinesFormArray = this.pipelinesGetter as FormArray;
    const timeFormControl = pipelinesFormArray.at(index).get('time');
    const dayFormControl = pipelinesFormArray.at(index).get('day');

    if (value?.key === 'daily') {
      timeFormControl?.setValidators([Validators.required]);
      timeFormControl?.updateValueAndValidity();
    } else if (value?.key === 'weekly') {      
      timeFormControl?.setValidators([Validators.required]);
      timeFormControl?.updateValueAndValidity();
      dayFormControl?.setValidators([Validators.required]);
      dayFormControl?.updateValueAndValidity();
    } else {
      timeFormControl?.setValidators([]);
      timeFormControl?.updateValueAndValidity();
      dayFormControl?.setValidators([]);
      dayFormControl?.updateValueAndValidity();
    }
  }

  submitApplicationForm = (applicationForm: FormGroup) => {
    if (applicationForm?.valid) {
      this.isSaveUpdateApplicationBtnDisabled = true;
      const applicationName = this.applicationNameGetter?.value ?? '';
      const outputFormat = this.outputFormatGetter?.value ?? {}
      const outputDestination = this.outputDestinationGetter?.value ?? {}
      const outputSite = this.outputSiteGetter?.value ?? {}
      const outputFolder = this.outputFolderGetter?.value ?? {}
      const pipelines = this.refactorPipelineData(this.pipelinesGetter?.value);
  
      const createUpdateApplicationReqBody = {
        "data": {
          "application_id": this.currentApplicationId,
          "application_name": applicationName,
          "output_format": outputFormat?.key ?? '',
          "output_destination": outputDestination?.key ?? '',
          "output_destination_details": {
            "site_id": outputSite?.id ?? '',
            "folder_name": outputFolder?.name ?? ''
          },
          "pipelines": pipelines,
        }
      };

      if (this.currentApplicationId) {
        // For UPDATING Application
        this.updateApplicationSubscription =
          this.applicationService.updateApplication(
            this.currentApplicationId,
            createUpdateApplicationReqBody
          ).subscribe({
            next: (updateApplicationResponse: any) => {
              if (updateApplicationResponse) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Application updated successfully.'
                });
                this.router.navigate(['/applications/']);
              }
            },
            error: (updateApplicationError: any) => {
              this.isSaveUpdateApplicationBtnDisabled = false;
              console.log(
                'Something went wrong while updating the application. ERROR -> ',
                updateApplicationError
              )
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong while updating application.'
              });
            }
          })
      } else {
        // For CREATING Application
        this.createApplicationSubscription =
          this.applicationService.createApplication(createUpdateApplicationReqBody).subscribe({
          next: (createApplicationResponse: any) => {
            if (createApplicationResponse) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Application created successfully.'
              });
              this.router.navigate(['/applications/']);
            }
          },
          error: (createApplicationError) => {
            this.isSaveUpdateApplicationBtnDisabled = false;
            console.log(
              'Something went wrong while creating application. ERROR -> ',
              createApplicationError
            );
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong while creating application.'
            });
          }
        })
      }
    }
  }

  ngOnDestroy(): void {
    this.configSubscription.unsubscribe();
    this.configurationSubscription.unsubscribe();
    this.createApplicationSubscription.unsubscribe();
    this.readApplicationSubscription.unsubscribe();
    this.updateApplicationSubscription.unsubscribe();
    this.testInstructionsSubscription.unsubscribe();
  }
}
