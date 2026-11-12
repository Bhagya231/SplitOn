
import { useState } from "react";

import { useLoaderData, Link, useNavigate, useRevalidator} from "react-router-dom";

import { ChevronRight, Home } from "lucide-react";
import bg from "../assets/membersbg.png"

import api from "../util/Api";

import GroupHeader from "../components/GroupHeader";
import EditGroupModal from "../components/EditGroupModal";
import DeleteConfirm from "../components/common/DeleteModal";
import { validateGroup } from "../util/validations"

export default function GroupDetailsPage() {

    const { group, expenses, expensePage, search } = useLoaderData();

    const navigate = useNavigate();
    const revalidator = useRevalidator();


    const [editingGroup, setEditingGroup] = useState(null);
    const [deletingGroup, setDeletingGroup] = useState(null);

    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");


    function handleOpenEdit(selectedGroup) {
        setEditingGroup(selectedGroup);
    }

    function handleOpenDelete(selectedGroup) {
        setDeletingGroup(selectedGroup);
    }

  
    async function handleUpdateGroup(groupId, request) 
    {
        setUpdating(true);

        try {
            await api.put(`/groups/${groupId}`, request);

            setErrorMessage("");
            setEditingGroup(null);
            revalidator.revalidate();

            return true;
        } catch (error)
        {
            console.error("Failed to update group:", error);

            setErrorMessage( error.response?.data?.message || "Failed to update group. Please try again.");

            return false;
        } finally {
            setUpdating(false);
        }
    }




   
    async function handleDeleteGroup() 
    {
        if (!deletingGroup) return;

        setDeleting(true);

        try {
            await api.delete(`/groups/${deletingGroup.id}`);

            setDeletingGroup(null);
            setErrorMessage("");

            navigate("/app", { replace: true });

        } catch (error) {
            console.error("Failed to delete group:", error);

            setErrorMessage( error.response?.data?.message || "Failed to delete group. Please try again.");

        } finally {
            setDeleting(false);
        }
    }

    return (

        
             <div className="container-fluid py-2 px-0" style={{
                        backgroundImage: `url(${bg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        }}
                         >

             <div className="container py-3 py-md-4" >
            
            <nav aria-label="breadcrumb" className="mb-4">

                <ol className="breadcrumb align-items-center mb-0 ">

                    <li className="breadcrumb-item ">

                        <Link
                            to="/app"
                            className="text-decoration-none text-muted
                            d-inline-flex align-items-center gap-1"
                        >
                            <Home size={16} />
                            Groups
                        </Link>

                    </li>

                    <li className="d-flex align-items-center mx-2">
                        <ChevronRight size={14} className="text-muted" />
                    </li>

                    <li
                        className="breadcrumb-item active"
                        aria-current="page"
                    >
                        {group?.name}
                    </li>

                </ol>

            </nav>

  
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}


            <GroupHeader
                group={group}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
            />

 
            <div className="mt-4">



            </div>

            <EditGroupModal
                show={Boolean(editingGroup)}
                group={editingGroup}
                onClose={() => setEditingGroup(null)}
                onUpdate={handleUpdateGroup}
                loading={updating}
                validateGroup={validateGroup}
            />

            
            <DeleteConfirm
                show={Boolean(deletingGroup)}
                title="Delete Group"
                itemName={deletingGroup?.name}
                message="Are you sure you want to delete this group?"
                onCancel={() => setDeletingGroup(null)}
                onConfirm={handleDeleteGroup}
                loading={deleting}
            />

        </div>
        </div>
    );
}
