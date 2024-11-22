import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
// import WebViewer, {WebViewerInstance} from "@pdftron/webviewer";
// import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  // @ViewChild('viewer') viewer!: ElementRef;

  // wvInstance!: WebViewerInstance;
  // @Output() coreControlsEvent:EventEmitter<string> = new EventEmitter();

  // private documentLoaded$!: Subject<void>;

  constructor(private primengConfig: PrimeNGConfig) {
    // this.documentLoaded$ = new Subject<void>();
  }

  ngOnInit() {
      this.primengConfig.ripple = true;
  }

  ngAfterViewInit(): void {
    // WebViewer({
    //   path: '../assets/lib',
    //   initialDoc: 'https://exposmartstoragedev.blob.core.windows.net/local-docs/AIXponent - Chat interface.xlsx',
    //   licenseKey: 'demo:1691580124560:7c58cc61030000000059155e8321f6c401227136f5dc60a73da0928367'  // sign up to get a free trial key at https://dev.apryse.com
    // }, this.viewer.nativeElement).then(instance => {
    //   this.wvInstance = instance;

    //   this.coreControlsEvent.emit(instance.UI.LayoutMode.Single);

    //   const { documentViewer, Annotations, annotationManager } = instance.Core;

    //   instance.UI.openElements(['notesPanel']);

    //   documentViewer.addEventListener('annotationsLoaded', () => {
    //     console.log('annotations loaded');
    //   });

    //   documentViewer.addEventListener('documentLoaded', () => {
    //     this.documentLoaded$.next();
    //     const rectangleAnnot = new Annotations.RectangleAnnotation({
    //       PageNumber: 1,
    //       // values are in page coordinates with (0, 0) in the top left
    //       X: 100,
    //       Y: 150,
    //       Width: 200,
    //       Height: 50,
    //       Author: annotationManager.getCurrentUser()
    //     });
    //     annotationManager.addAnnotation(rectangleAnnot);
    //     annotationManager.redrawAnnotation(rectangleAnnot);
    //   });
    // })
  }
}
