import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spiner.service';

@Component({
  selector: 'app-spiner',
  templateUrl: './spiner.component.html',
  styleUrls: ['./spiner.component.scss']
})
export class SpinerComponent implements OnInit {

  isLoading$ = this.spinnerService.isLoading$;

  constructor(
    private spinnerService : SpinnerService
  ) { }

  ngOnInit(): void {
  }

}
