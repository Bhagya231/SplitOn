
import { useState } from "react";
import { Card } from "react-bootstrap";
import { CalendarDays, Users,Pencil,MoreVertical,Trash2 } from "lucide-react";
import { getGroupVisual } from "../util/getGroupVisual";

import Food from "../assets/food.png"




// const groupVisuals = [
//     { keywords: ["goa", "trip", "travel", "vacation"], image: travelImage },
//     { keywords: ["food", "dinner", "lunch"], image: foodImage },
//     { keywords: ["shopping", "shop"], image: shoppingImage },
//     { keywords: ["movie", "entertainment"], image: movieImage },
//     { keywords: ["home", "family", "flat"], image: homeImage },
//     { keywords: ["office", "work", "project", "college"], image: workImage }
// ];

export default function GroupHeader({ group, onEdit, onDelete })
{

    const [showMenu, setShowMenu] = useState(false);
    const visual = getGroupVisual(group?.name);

    const createdDate = group?.createdAt ? new Date(group.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"}) : "Not available";

    const memberCount = group?.groupMembers?.length ?? 0;

    return (
        <Card className="border-0 shadow-sm rounded-4 position-relative">
            <Card.Body className="p-3 p-md-4">

                <div className="d-flex flex-column flex-md-row  align-items-start align-items-md-center gap-3">

                    <img src={visual.image} alt={group?.name || "Group"} className="rounded-circle object-fit-cover flex-shrink-0" width="120" height="120" />

                    <div className="flex-grow-1 pe-5">

                        <div className="d-flex align-items-center flex-wrap gap-2 mb-2">

                            <h2 className="fw-bold mb-0">
                                {group?.name}
                            </h2>

                        </div>

                        <p className="text-secondary mb-3">
                            {group?.description || "No description added yet."}
                        </p>

                        <div className="d-flex flex-wrap align-items-center  gap-3 text-secondary">

                            <div className="d-flex align-items-center gap-2">
                                <CalendarDays size={18} />
                                <span>
                                    Created on: {createdDate}
                                </span>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <Users size={18} />
                                <span>
                                    {memberCount} Members
                                </span>
                            </div>

                        </div>

                    </div>

                   
                    <div className="position-absolute top-0 end-0 m-3" data-no-card-navigation style={{ zIndex: 20 }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="btn btn-light btn-sm rounded-circle border-0 d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: "36px", height: "36px" }}
                onClick={(e) => {  setShowMenu(prev => !prev); }} >
                <MoreVertical size={18} />
                </button> 

          {showMenu && (
            <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow border py-2"
              style={{ width: "160px",zIndex: 10,}} onClick={e => e.stopPropagation()} >
                <button type="button" className="btn btn-sm w-100 btn-outline-primary text-start px-3 py-2 border-0 rounded-0 group-menu-item"
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false);onEdit(group); }} >
                    <Pencil size={18} />
                    Edit Group
                </button>

                <button type="button"  className="btn btn-sm w-100 text-start btn-outline-danger px-3 py-2 border-0 rounded-0  group-menu-item"
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(group);}}>
                    <Trash2 size={18} />
                    Delete Group
                </button>
            </div>
          )}
        </div>



            <div className="ms-auto d-none d-md-flex align-items-center justify-content-center flex-shrink-0">
                <img
                    src={Food}
                    alt="food"
                    className="img-fluid"
                    style={{
                        width: "280px",
                        height: "150px",
                        objectFit: "contain"
                    }}
                />
            </div>
                </div>

            </Card.Body>
        </Card>
    );
}
