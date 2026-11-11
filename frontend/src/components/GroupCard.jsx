
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGroupVisual } from "../util/getGroupVisual";

export default function GroupCard({ group, onEdit, onDelete }) 
{
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const visual = getGroupVisual(group.name);
  const Icon = visual.icon;


    function formatDate(date) 
    {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
    }

    function handleOpenGroup() 
    {
        console.log("Navigating to:", `/app/groups/${group.id}`);
        navigate(`/app/groups/${group.id}`);
    }

    function handleCardClick(e) 
    {
    
        if (e.target.closest("[data-no-card-navigation]")) {
            return;
        }

        handleOpenGroup();
    }
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100" role="button" onClick={handleCardClick}>
      
      <div className="position-relative overflow-visible p-3"  style={{ minHeight: "175px" }} >

       
        {visual.image && (
          <img src={visual.image} alt={group.name} className="position-absolute bottom-0 end-0 pe-1"
            style={{ width: "145px", height: "105px",objectFit: "contain",opacity: 0.9, zIndex: 0,pointerEvents: "none", }} />
        )}

        
        <div className="position-absolute top-0 end-0 m-3" data-no-card-navigation style={{ zIndex: 20 }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="btn btn-light btn-sm rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: "36px", height: "36px" }}
                onClick={(e) => { e.stopPropagation();  setShowMenu(prev => !prev); }} >
                <i className="bi bi-three-dots-vertical fs-5" />
                </button>

          {showMenu && (
            <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow border py-2"
              style={{ width: "160px",zIndex: 10,}} onClick={e => e.stopPropagation()} >
                <button type="button" className="btn btn-sm w-100 btn-outline-primary text-start px-3 py-2 border-0 rounded-0 group-menu-item"
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false);onEdit(group); }} >
                    <i className="bi bi-pencil me-2" />
                    Edit Group
                </button>

                <button type="button"  className="btn btn-sm w-100 text-start btn-outline-danger px-3 py-2 border-0 rounded-0  group-menu-item"
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(group);}}>
                    <i className="bi bi-trash me-2" />
                    Delete Group
                </button>
            </div>
          )}
        </div>

       
        <div className="d-flex align-items-center gap-2 pe-5 position-relative" style={{ zIndex: 1 }} >
            <div  className={`${visual.bg} ${visual.color} rounded-circle d-flex align-items-center justify-content-center`}
                style={{  width: "65px",height: "65px",flexShrink: 0,}} >
                <Icon size={30} />
            </div>

            <div>
                <h5 className="fw-bold mb-1 text-dark">
                    {group.name}
                </h5>

                <p className="text-secondary small mb-1">
                    {group.description}
                </p>
            </div>
        </div>
    </div>

     
    <div className="card-body pt-0">

        <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
                {group.groupMembers?.slice(0, 4).map((item, index) => {
                const name = item.memberName || "";

                return (
                    <div key={item.id || item.memberId}  title={name}
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary bg-primary-subtle border border-2 border-white"
                        style={{ width: "36px", height: "36px",marginLeft: index === 0 ? "0" : "-12px",zIndex: 4 - index,fontSize: "13px",   }} >
                        {name.charAt(0).toUpperCase()}
                    </div>
                );
                })}

                {group.groupMembers?.length > 4 && (
                <div  className="rounded-circle d-flex align-items-center justify-content-center bg-secondary-subtle text-secondary border border-2 border-white fw-semibold"
                    style={{ width: "36px",height: "36px",marginLeft: "-12px",fontSize: "12px", }} >
                        +{group.groupMembers.length - 4}
                </div>
                )}
            </div>

            <span className="text-secondary small ms-2">
                {group.groupMembers?.length || 0} Members
            </span>
        </div>

       
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 border-top pt-3 mt-3">

            <small className="text-secondary">
                Created:{" "}
                {formatDate(group.createdAt)}
                {/* {group.createdAt ? new Date(group.createdAt).toLocaleDateString() : "-"} */}
            </small>

            <button type="button"  className="btn btn-primary btn-sm"
                onClick={(e) => {  e.stopPropagation(); handleOpenGroup(); }} >
                View Group
                <i className="bi bi-arrow-right ms-2" />
            </button>

        </div>
      </div>
    </div>
  );
}
