export class Contact {
    id?: number;
    name: string;
   color: string;
email: string;
        phone: string;
   initials: string;
   author: number;


    constructor(obj?:any){
        this.id = obj ? obj.id: null;
        this.name = obj ? obj.name : '';
        this.author = obj ? obj.author : '';
        this.initials = obj? obj.initials : '';
        this.color = obj ? obj.color: '';
        this.email = obj ? obj.email: '';
        this.phone = obj ? obj.phone: '';
      

    }

    public toJSON(){
    return {
        id: this.id,
        name : this.name,
        author : this.author,
        color: this.color,
        phone : this.phone,
        email: this.email,
        initials: this.initials
       
    }
    
    }

  
    
}