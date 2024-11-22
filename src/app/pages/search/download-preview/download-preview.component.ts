import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/common/services/api.service';

@Component({
  selector: 'app-download-preview',
  templateUrl: './download-preview.component.html',
  styleUrls: ['./download-preview.component.scss']
})
export class DownloadPreviewComponent {
  @Input() data: any = [];
  @Output() clickevent = new EventEmitter<string>();
  showthumnails: boolean = true
  shownavigator: boolean = false
  activeIndex: any = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService
    ) {
  }

  ngOnInit(): void {
    if(window.innerWidth < 960){
      this.showthumnails = false
      this.shownavigator = true;
    }
  }

  downloadSlide(){
    this.clickevent.emit(this.data)
  }
}
