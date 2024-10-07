
class MessageModel {

    title: string;        // required fiels
    question: string;    // required field
    id?: number;
    userEmail?: string;     // these are optional field ie with ? wildcard hence constructor for these attributes are not requiored
    adminEmail?: string;
    response?: string;
    closed?: boolean;

    constructor(title: string, question: string){
        this.title = title;
        this.question = question;
    }

}

export default MessageModel;