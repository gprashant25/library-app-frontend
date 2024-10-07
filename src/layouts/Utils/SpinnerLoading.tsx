
// Please note: that our Utils folder are going to be the layouts that are reusable across other componenets such  as Spinner that's showing that something is loading can be used more than one time.

export const SpinnerLoading = () => {

    return (
        <div className="container mt-5 d-flex justify-content-center" style={{height: 550}}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">
                    Loading...
                </span>

            </div>

        </div>

    );
}