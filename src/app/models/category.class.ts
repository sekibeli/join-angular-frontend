export class Category {
    id?: number;
    title: string;
    color: string;
    author?: number;


    constructor(obj?: any) {
        this.id = obj ? obj.id : null;
        this.title = obj ? obj.title : '';
        this.color = obj ? obj.color : '';
        this.author = obj ? obj.author : '';
    }

    public toJSON() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            color: this.color,
        }
    }
}