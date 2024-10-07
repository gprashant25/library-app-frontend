import { Carousel } from "./components/Carousel";
import { ExploreTopBooks } from "./components/ExploreTopBooks";
import { Heros } from "./components/Heros";
import { LibraryServices } from "./components/LibraryServices";

export const HomePage = () => {

    return (

        // using this <></> which is called frament, we're saying that we want to return each of this as a single element; without using a div or span tag linke that
        <>
            <ExploreTopBooks />
            <Carousel />
            <Heros />
            <LibraryServices />

        </>

    );
}