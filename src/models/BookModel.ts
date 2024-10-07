
// Below code we're writing bcos when we call an API form our springBoot application, we can easily convert it into a TypeScript object that we can use within our application. Hence we have to add the variables and the attributes of backend springboot application Book entity.
// Hence to consume the REST API of what we created in backend server so we have to create a model. And in this model is going to have all the information of what a book looks like on the Backend and in the database

class BookModel {

    id: number;
    title:string;
    author?: string;   // by addinmg a question mark means this is just optional variable. And this author variable can be Null
    description?: string;
    copies?: number;
    copiesAvailable?: number;
    category?: string;
    img?: string;

    // below creating a constructor to create our objects, when we have this data. so this is exactly what we need for our book model.
    constructor(id: number, title: string, author:string, description:string,
        copies:number, copiesAvailable:number, category:string, img:string) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.description = description;
            this.copies = copies;
            this.copiesAvailable = copiesAvailable;
            this.category = category;
            this.img = img;
        }
}

export default BookModel;