 function Card({ title, children, className = "",headerClassName="",bodyClassName="",header }) 
{
  return (
    <div className={`card shadow border-0 mb-3 ${className}`}>

       {(title || header) && (
                <div  className={`card-header border-0 ${headerClassName || "bg-white" }`} >
                    {header ? ( header ) : (
                        <h5 className="fw-bold mb-0">
                            {title}
                        </h5>
                    )}
                </div>
            )}

      <div className= {`card-body ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}


export default Card;


