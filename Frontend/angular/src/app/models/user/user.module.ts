import { Injectable } from '@angular/core';
  
export class User{
    constructor( 
        public username: string,
        public password: string,
        ){}
}
export class UserToAdd{
  constructor( 
    public EmailUser: string,
    public PasswordUser: string,
      ){}
}

export class UserData{
  constructor( 
    public nombre?: string,
    public roles?: [string],
    ){}
}
