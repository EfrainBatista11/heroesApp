import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

    private baseUrl: string = environments.baseUrl;
    private user?: User; // Opcional porque en un momento del tiempo no esta definido

    constructor(private http: HttpClient) { }
    
    get currentUser(): User | undefined{
        if ( !this.user) return undefined;
        return structuredClone(this.user);
    }

    login(email: string, password: string): Observable<User>{
        
        // En la vida real
        // http.post('login', {email, password});

        // Esta es solo de ejemplo
       return this.http.get<User>(`${ this.baseUrl}/users/1`)
        .pipe(
            tap( user => this.user = user),
            // Guardo el id como si fuera token
            tap(user => localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')), 
        );
        // Falta el catch error
    }

    checkAuthentication(): Observable<boolean>{

        if (!localStorage.getItem('token')) return of(false);

        const token = localStorage.getItem('token');

        return this.http.get<User>(`${ this.baseUrl}/users/1`)
        .pipe(
            tap( user => this.user = user),
            map( user => !!user ), // Esta doble negación es javascript 
            catchError( err => of(false))
        )
    }

    logout(){
        this.user = undefined;
        localStorage.clear(); // Remover cualquier cosa del local storage
    }


}