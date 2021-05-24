import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, find, mergeMap, pluck, take, tap, withLatestFrom} from 'rxjs/operators';
import { Characters, DataResponse, Episodes } from '../interfaces/data.interface';
import { LocalStorageService } from './localStorage.service';


// Llamado desde Graphql
const QUERY = gql `
{
  episodes {
    results{
      name
      episode
    }
  }
  characters {
    results{
      id
      name
      status
      species
      gender
      image
    }
  }
}`;


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private episodeSubject = new BehaviorSubject<Episodes[]>([]);
  episode$ = this.episodeSubject.asObservable();

  private charactersSubject = new BehaviorSubject<Characters[]>([]);
  characters$ = this.charactersSubject.asObservable(); // Varibles de tipo observable

  constructor(
    private apollo: Apollo,
    private localStorage: LocalStorageService
  ) {  this.getDataApi(); }


  //Recoremos el el array de personajes con el mermap y lo devolvemos al ID con el find.
  getDetails(id:number){
    return this.characters$.pipe(
      mergeMap( (characters: Characters[]) => characters ),
      find( (characters: Characters) => characters?.id === id)
    );
  }  

  getCharactersByPage(pageNum: number): void {
    const QUERY_BY_PAGE = gql`{
      characters(page: ${pageNum}) {
        results {
          id
          name
          status
          species
          gender
          image
        }
      }
    }`;

    this.apollo.watchQuery<any>({
      query: QUERY_BY_PAGE
    }).valueChanges.pipe(
      take(1),
      pluck('data', 'characters'),
      withLatestFrom(this.characters$),
      tap(([apiResponse, characters]) => {
        this.parseCharactersData([...characters, ...apiResponse.results]);
      })
    ).subscribe();
  }

  filterData(valueToSearch: string){
    const QUERY_BY_NAME = gql `
      query ($name:String){
        characters(filter: {name: $name}){
          info{
            count
          }
          results{
            id
            name
            status
            species
            gender
            image
          }
        }
      }`;
    this.apollo.watchQuery<any>(
      {
        query: QUERY_BY_NAME,
        variables:{
          name: valueToSearch
        }
      }).valueChanges
      .pipe(
        take(1),
        pluck('data', 'characters'),
        tap((apiResponse) => this.parseCharactersData([...apiResponse.results])),
        catchError( error => {
          console.log(error.message);
          this.charactersSubject.next(null); // Setea todos los personajes a null o no se muestra nada
          return of(error);
        })
      ).subscribe();
  }
  

    // Hacemos el llamado al Query mediante apollo
  getDataApi():void{
    this.apollo.watchQuery<DataResponse>({
      query:QUERY
    }).valueChanges.pipe(
      take(1),
      tap( ({data}) => {
        const {characters, episodes} = data // Se realiza una destructuracion de la informacion y todo se guarda en data
        this.episodeSubject.next(episodes.results);
        //this.charactersSubject.next(characters.results);
        this.parseCharactersData(characters.results);
      })
    ).subscribe();
  }

  private parseCharactersData(characters: Characters[]) :void{
    const currentsFavs = this.localStorage.getFavoriteCharacters();
    const newData = characters.map( characters => {
      const found = !!currentsFavs.find( (fav:Characters) => fav.id === characters.id);
      return {...characters, isFavorite: found};
    });
    this.charactersSubject.next(newData);
  }
}
