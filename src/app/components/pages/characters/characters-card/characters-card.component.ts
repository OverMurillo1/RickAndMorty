import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Characters } from './../../../../shared/interfaces/data.interface';
import { LocalStorageService } from './../../../../shared/services/localStorage.service';

@Component({
  selector: 'app-characters-card',
  templateUrl: './characters-card.component.html',
  styleUrls: ['./characters-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersCardComponent implements OnInit {

  @Input() character: Characters

  constructor(
    private localStorage : LocalStorageService
  ) { }

  ngOnInit(): void {
  }

  toggleFavorite():void{
    const isFavorite = this.character.isFavorite;
    this.getIcon();
    this.character.isFavorite = !isFavorite; 
    this.localStorage.addOrRemoveFavorite(this.character)
  }

  getIcon():string{
    return this.character.isFavorite ? 'heart-solid.svg' : 'heart.svg'
  }
}
