import { Injectable } from '@angular/core';

export interface User {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user?: User;
  constructor() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  set(user: User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  get(): User {
    const user = this.user || JSON.parse(localStorage.getItem('user') || '{}');
    return user as User;
  }
}
