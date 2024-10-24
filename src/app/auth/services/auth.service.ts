import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, tap } from 'rxjs';

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
       return this.http.get<User>(`${ this.baseUrl}/user/1`)
        .pipe(
            tap( user => this.user = user),
            // Guardo el id como si fuera token
            tap(user => localStorage.setItem('token', user.id.toString())), 
        );
        // Falta el catch error
    }
}