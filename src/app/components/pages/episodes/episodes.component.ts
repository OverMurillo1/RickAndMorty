import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent implements OnInit {

  episodes$ = this.dataSVC.episode$;

  constructor(
    private dataSVC : DataService
  ) { }

  ngOnInit(): void {
  }

}
