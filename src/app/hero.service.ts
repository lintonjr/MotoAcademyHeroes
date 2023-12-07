import { Injectable } from '@angular/core';
import { HEROES } from './heroes/mocks/Hero.mocks';
import { Hero } from './Hero';
import { Observable, catchError, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ){}

  private heroesUrl = 'api/heroes'
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  getHeroesMock():Observable<Hero[]> {
    
    this.messageService.add("Hero Service: fetched heroes");
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        catchError(this.handleError<Hero[]>('getHeroes', []))
      )  ;
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);  
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  
  private log(message:string) {
    this.messageService.add(`HeroService: ${message}`)    
  }

  getHero(id: number):Observable<Hero> {
    // const hero = HEROES.find(heroValue => heroValue.id === id)!;
    // this.messageService.add(`HeroService: Fetched hero id=${id}`)
    // return of(hero)
    // 
    const url = `${this.heroesUrl}/${id}`
    return this.http.get<Hero>(url)
    .pipe(
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
}

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>(`updateHero`))
      )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        catchError(this.handleError<Hero>('addHero'))
      )
  } 

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

}
