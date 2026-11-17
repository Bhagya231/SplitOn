
import { useSearchParams } from "react-router-dom";

export default function ExpensePagination({ expensePage }) 
{
  const [searchParams, setSearchParams] = useSearchParams();

  
    if ( !expensePage || expensePage.totalElements === 0 || expensePage.totalPages <= 1 )
    {
        return null;
    }

  const {number,totalPages,totalElements,size,first,last} = expensePage;

  
  function handlePageChange(page) 
  {
    const params = new URLSearchParams(searchParams);

    params.set("page", page);

    setSearchParams(params);
  }

 
  const start = number * size + 1;
  const end = Math.min((number + 1) * size, totalElements);

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">

      
      <small className="text-muted">
        Showing {start} - {end} of {totalElements} expenses
      </small>

     
      <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center">

       
        <button  type="button" className="btn btn-outline-primary btn-sm" disabled={first}
            onClick={() => handlePageChange(number - 1)} >
            Previous
        </button>

        
        {Array.from({ length: totalPages }, (_, index) => index).map(
          (page) => (
            <button key={page} type="button" className={`btn btn-sm ${number === page? "btn-primary": "btn-outline-primary" }`}
              onClick={() => handlePageChange(page)} >
              {page + 1}
            </button>
          )
        )}

       
        <button type="button"  className="btn btn-outline-primary btn-sm" disabled={last} onClick={() => handlePageChange(number + 1)}>
          Next
        </button>

      </div>
    </div>
  );
}
