

// Pagination is going to show the numbers at the bootom of the page, and when you click a number its going to display new books.

export const Pagination: React.FC<{
    currentPage: number,
    totalPages: number,
    paginate: any
}> = (props) => {

    const pageNumbers = [];

    if (props.currentPage === 1) {
        pageNumbers.push(props.currentPage);

        if (props.totalPages >= props.currentPage + 1) {
            pageNumbers.push(props.currentPage + 1);
        }

        if (props.totalPages >= props.currentPage + 2) {
            pageNumbers.push(props.currentPage + 2);
        }

    } else if (props.currentPage > 1) {

        if (props.currentPage >= 3) {
            pageNumbers.push(props.currentPage - 2);
            pageNumbers.push(props.currentPage - 1);
        } else {
            pageNumbers.push(props.currentPage - 1);
        }

        
        pageNumbers.push(props.currentPage);

        if (props.totalPages >= props.currentPage + 1) {
            pageNumbers.push(props.currentPage + 1);
        }

        if (props.totalPages >= props.currentPage + 2) {
            pageNumbers.push(props.currentPage + 2);
        }
    }


    return (

        <nav aria-label="...">

            <ul className="pagination">

                <li className="page-item " onClick={() => props.paginate(1)}>
                    <button className="page-link"> First Page</button>
                </li>

                {pageNumbers.map(number => (
                    <li key={number} onClick={() => props.paginate(number)}
                        // IMP: PLEASE NOTE: in below className write 'page-item ' which means 'page-item active'. KEEP SPACE in between page-item & active
                        className={'page-item ' + (props.currentPage === number ? 'active' : '')}> 
                        <button className="page-link"> {number}</button>
                    </li>
                ))}

                <li className="page-item" onClick={() => props.paginate(props.totalPages)}>
                    <button className="page-link  "> Last Page</button>
                </li>

            </ul>

        </nav>

    );
}