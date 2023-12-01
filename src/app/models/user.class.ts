export class User {
    id?: number;
    username: string;
   email: string;
vorname: string;
        nachname: string;
  


    constructor(obj?:any){
        this.id = obj ? obj.id: null;
        this.username = obj ? obj.username : '';
        this.email = obj ? obj.email : '';
        this.vorname = obj? obj.vorname : '';
        this.nachname = obj ? obj.nachname: '';
    
      

    }

    public toJSON(){
    return {
        id: this.id,
        username : this.username,
        vorname : this.vorname,
        nachname: this.nachname,
        email: this.email,
             
    }
    
    }

  
    
}