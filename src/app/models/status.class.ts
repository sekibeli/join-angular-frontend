export class Status {
    id: number;
    title: string;

    constructor(id: number, title: string = '') {
        this.id = id;
        this.title = title;
    }

    public toJSON() {
        return {
            id: this.id,
            title: this.title,
        }

    }

}