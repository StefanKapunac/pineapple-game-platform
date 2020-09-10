import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private static readonly signInUrl = "https://localhost:5430/api/Users/login";
    private static readonly signUpUrl = "https://localhost:5430/api/Users/register";

    username = '';
    isUserSignedIn = false;

    constructor(private http: HttpClient) {}

    public signIn(user) {
        return this.http.post(AuthService.signInUrl, user);
    }

    public signUp(user) {
        return this.http.post(AuthService.signUpUrl, user);
    }
}
