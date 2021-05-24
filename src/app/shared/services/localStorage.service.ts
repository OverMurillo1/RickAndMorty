import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Characters } from '../interfaces/data.interface';
//import { ToastrService } from 'ngx-toastr';

const MY_FAV = 'myFavorites'

@Injectable({
    providedIn: 'root' // Se injecta el localstorage en el root de la aplicacion
})

export class LocalStorageService {

    private charactersFVSubject = new BehaviorSubject<Characters[]>(null);
    charactersFV$ = this.charactersFVSubject.asObservable();

constructor(
    //private toastrSVC : ToastrService
){
    this.initialStorage()
}
    // Buscamos los favoritos si existen o no
    addOrRemoveFavorite(character: Characters):void{
        const {id} = character;                         //recibimos el personaje por el ID
        const currentsFav = this.getFavoriteCharacters();  //Todos los persoajes fav guardados
        const found = !!currentsFav.find( (fav: Characters) => fav.id === id); // usar FIND de JS para comparar los favoritos 
        found ? this.removeFromfavorite(id) : this.addFromFavorite(character); // aqui añadimos o quitamos los favoritos
    };

    private addFromFavorite(character: Characters):void{
        try {
            const currentsFav = this.getFavoriteCharacters();
            localStorage.setItem(MY_FAV, JSON.stringify([...currentsFav,character]));
            this.charactersFVSubject.next([...currentsFav,character]);
            alert("Se ha agrego a favoritos :)")
        } catch (error) {
            console.log('error al guardar en el local storage', error)
            alert("No se pudo agregar a favoritos :(")
        }
    }

    private removeFromfavorite(id: number):void{
        try {
            const currentsFav = this.getFavoriteCharacters();
            const characters = currentsFav.filter(item => item.id != id);
            localStorage.setItem(MY_FAV, JSON.stringify([...characters]));
            this.charactersFVSubject.next([...characters]);
            alert("Se ha eliminado de favoritos :(")
        } catch (error) {
            console.log('error al borrar en el local storage', error)
            alert("No se pudo remover de favoritos :(")
        }
    }
    

    // Guardamos todos lo favoritos
    getFavoriteCharacters():any{ 
        try {
            const charactersFav = JSON.parse(localStorage.getItem(MY_FAV));
            this.charactersFVSubject.next(charactersFav);
            return charactersFav;
        }catch(error) {
            console.log('No se ha podido guardar el favorito', error)
        }
    }

    //Limpiamos el local storage
    clearStorage():void{
        try{
            localStorage.clear();
        }catch(error){
            console.log('No se ha podido limpiar el almacenamiento', error)
        }
    }

    private initialStorage(): void{
        const currents = JSON.parse(localStorage.getItem(MY_FAV));
        if( !currents ){
            localStorage.setItem(MY_FAV, JSON.stringify([]))
        }
        this.getFavoriteCharacters();
    }
}