import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {

  search = new FormControl();
  private destroy$ = new Subject<unknown>();

  constructor(
    private dataSVC : DataService
  ) { 
    this.onSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  onClear():void{
    this.search.reset();
    this.dataSVC.getDataApi(); 
  }

  onSearch():void{
    this.search.valueChanges.pipe(
      map( search => search?.toLowerCase().trim()),
      debounceTime(300), //Demorar al digitar en la busqueda
      distinctUntilChanged(), //Buscar unicos
      filter( search => search != "" && search?.length > 2), // comenzar a bsucar mayor a dos letras
      tap( search => this.dataSVC.filterData(search)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

}
