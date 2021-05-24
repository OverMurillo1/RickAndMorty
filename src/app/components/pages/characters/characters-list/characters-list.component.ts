import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DataService } from './../../../../shared/services/data.service';
import { LocalStorageService } from './../../../../shared/services/localStorage.service';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent{

  characters$ = this.dataSVC.characters$;
  showButton = false;
  
  private scrollheight = 500;
  private pageNum = 1;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dataSVC: DataService,
    private localStorage: LocalStorageService
  ) { }

  @HostListener('window:scroll')
  onWindowScroll():void{
    const yOffSet = window.pageYOffset;
    const scrollTop = this.document.documentElement.scrollTop;
    this.showButton = (yOffSet || scrollTop) > this.scrollheight;
  }

  onScrollTop():void{
    this.document.documentElement.scrollTop = 0;
  }
  onScrollDown():void{
    this.pageNum++;
    this.dataSVC.getCharactersByPage(this.pageNum);
  }
}
