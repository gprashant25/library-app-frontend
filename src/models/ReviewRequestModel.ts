class ReviewRequestModel {

    rating: number;
    bookId: number;

    // here below we're using the ? wildcard bcos the reviewDescription is optional for user
    reviewDescription?: string;

    constructor(rating: number, bookId: number, reviewDescription: string){
        this.rating = rating;
        this.bookId = bookId;
        this.reviewDescription = reviewDescription;
    }

}

export default ReviewRequestModel;