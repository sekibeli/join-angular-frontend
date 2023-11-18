export class Subtask {
    id?: number;
    title: string;
    completed: boolean;
    task?: number;

    constructor(id: number, title: string = '', completed: boolean, task: number) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.task = task
    }

    public toJSON() {
        return {
            id: this.id,
            title: this.title,
            completed: this.completed,
            task: this.task
        }

    }

}