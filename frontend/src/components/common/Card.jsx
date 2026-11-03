 function Card({ title, children, className = "" }) 
{
  return (
    <div className={`card shadow border-0 mb-3 ${className}`}>
      {title && (
        <div className="card-header  bg-white border-0 fw-bold fs-3 pt-3 pb-0">
          {title}
        </div>
      )}

      <div className="card-body">
        {children}
      </div>
    </div>
  );
}


export default Card;


