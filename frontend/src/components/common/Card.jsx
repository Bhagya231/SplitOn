 function Card({ title, children, className = "",headerClassName="",bodyClassName="" }) 
{
  return (
    <div className={`card shadow border-0 mb-3 ${className}`}>
      {title && (
        <div className={`card-header  bg-white border-0 fw-bold fs-3 pt-3 pb-0 ${headerClassName} `}>
          {title}
        </div>
      )}

      <div className= {`card-body ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}


export default Card;


