
import { useLoaderData } from "react-router-dom";

import { useEffect, useState } from "react";
import EditGroupModal from "../components/EditGroupModal";
import DeleteConfirm from "../components/common/DeleteModal";
import GroupCard from "../components/GroupCard";

import Img from "../assets/loginbg.png";
import bg from "../assets/membersbg.png"
import FormInput from "../components/common/FormInput";
import CreateGroupModal from "../components/CreateGroupModal";
import api from "../util/Api";




   


export default function GroupsPage() 
{

    const data = useLoaderData();
  
    const [groups, setGroups] = useState(data.content || []);
    const [search, setSearch] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [creating, setCreating] = useState(false);

    const [editingGroup, setEditingGroup] = useState(null);
    const [updating, setUpdating] = useState(false);

    const [deletingGroup, setDeletingGroup] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        if (!errorMessage) return;

        const timer = setTimeout(() => {
        setErrorMessage("");
        }, 4000);

        return () => clearTimeout(timer);
    }, [errorMessage]);

     function validateGroup({ name, description }) 
     {
        const errors = {};

        if (!name.trim()) {
        errors.name = "Group name is required";
        } else if (name.trim().length < 3) {
        errors.name = "Group name must contain at least 3 characters";
        } else if (name.trim().length > 100) {
        errors.name = "Group name cannot exceed 100 characters";
        }

        if (!description.trim()) {
        errors.description = "Description is required";
        } else if (description.trim().length < 5) {
        errors.description = "Description must contain at least 5 characters";
        } else if (description.trim().length > 500) {
        errors.description = "Description cannot exceed 500 characters";
        }

        return errors;
    }


    function handleClearSearch() 
    {
        setSearch("");
        handleSearch("");
    }

    

    async function fetchMembers()
     {
        setLoadingMembers(true);

        try {
            const response = await api.get("/members/getAll");

            
            setMembers(response.data.content || response.data);

        } catch (error) {
            console.error("Failed to fetch members", error);
             setErrorMessage(error.response?.data?.message || "Failed to load members.");
        } finally {
            setLoadingMembers(false);
        }
    }

    async function handleOpenCreateModal() 
    {
        await fetchMembers();
        setShowCreateModal(true);
    }



    async function handleCreateGroup(request) {
        setCreating(true);

        try {
            const response = await api.post("/groups", request);

            setGroups(prev => [response.data, ...prev]);

            return true;

        } catch (error) {
            console.error("Failed to create group:",error.response?.data || error.message);
            setErrorMessage( error.response?.data?.message || "Failed to create group. Please try again." );
            return false;

        } finally {
            setCreating(false);
        }
    }


    async function handleSearch(searchValue = search)
    {
        try {
            if(!searchValue)
            {

                const response = await api.get("/groups", {
                params: {
                    search: searchValue.trim(),
                    page: 0,
                    size: 5
                }
            });

            setGroups(response.data.content || []);
            }



        } catch (error) {
            setErrorMessage( error.response?.data?.message || "Failed to search the group. Please try again." );
            console.error("Error searching groups:", error);

        }
    };


    function handleOpenEdit(group) 
    {
        setEditingGroup(group);
    }

 
    async function handleUpdateGroup(groupId, request) 
    {
        setUpdating(true);

        try {
            const response = await api.put(`/groups/${groupId}`, request);

            setGroups(previous => previous.map(group => group.id === groupId ? { ...group, ...response.data } : group));

            setErrorMessage("");
            return true;

        } catch (error) {
            console.error("Failed to update group:", error);
            setErrorMessage( error.response?.data?.message || "Failed to update group. Please try again.");

        return false;
        } finally {
        setUpdating(false);
        }
    }

    function handleOpenDelete(group)
    {
        setDeletingGroup(group);
    }


    async function handleDeleteGroup() 
    {
        if (!deletingGroup) 
        {
            return;
        }

        setDeleting(true);

        try {
            await api.delete(`/groups/${deletingGroup.id}`);

            setGroups(previous => previous.filter(group => group.id !== deletingGroup.id) );

            setDeletingGroup(null);
            setErrorMessage("");
        } catch (error) {
        console.error("Failed to delete group:", error);
        setErrorMessage( error.response?.data?.message || "Failed to delete group. Please try again." );

        } finally {
        setDeleting(false);
        }
    }

       
    return (
        <div className="container-fluid py-2 px-0"
            style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            }} >

            
            <div  className="rounded-4 overflow-hidden mb-3 mx-3 my-2"
                style={{
                    minHeight: "180px",
                    backgroundImage: `url(${Img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                }}>

                <div  className="h-100 d-flex flex-column justify-content-center p-4 p-md-5"
                    style={{ minHeight: "180px",  background:"linear-gradient(90deg, rgba(15,35,75,0.85), rgba(15,35,75,0.15))",  }} >
                    <div className="mb-4">
                        <h1 className="fw-bold text-white mb-2">
                             My Groups
                        </h1>

                        <p className="text-white mb-0">
                            Manage your groups and keep all your shared expenses organized in one place.
                        </p>
                    </div>

                    <div className="mx-3 ">
                        <div className="row g-3 align-items-start">

                
                            <div className="">
                                <div className="row g-2 align-items-start">

                                    <div className="col-6">
                                    <FormInput
                                        name="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search groups by name..."
                                    />
                                    </div>

                                    <div className="col-auto">
                                        <button type="button" className="btn text-white px-3"
                                            style={{
                                            backgroundColor: "#244B9B",
                                            minHeight: "38px",
                                            whiteSpace: "nowrap",
                                            }}
                                            onClick={handleSearch} >
                                            <i className="bi bi-search me-2"></i>
                                            Search
                                        </button>
                                    </div>

                                    <div className="col-auto">

                                         <button type="button" className="btn  text-white px-3"
                                            style={{
                                            backgroundColor: "#244B9B",
                                            minHeight: "38px",
                                            whiteSpace: "nowrap",
                                            }}
                                            onClick={handleClearSearch}  disabled={!search.trim()}>
                                            
                                            Clear
                                        </button>
                                       
                                    </div>

                                </div>
                            </div>

                                
                            

                        </div>
                    </div>
                </div>
            </div>

           
            {errorMessage && (
            <div className="alert alert-danger alert-dismissible fade show mx-3" role="alert" >
                <i className="bi bi-exclamation-circle me-2"></i>
                {errorMessage}

                <button type="button" className="btn-close" onClick={() => setErrorMessage("")} aria-label="Close" />
            </div>
            )}


            {/* <div className="mb-3 mx-3">
                <div>
                    <h4
                    className="fw-bold mb-1"
                    style={{ color: "#172D62" }}
                    >
                    Your Groups
                    </h4>

                    <p className="text-secondary mb-0">
                    Manage all your groups in one place.
                    </p>
                </div>
            </div> */}

            
            

            


            
            <div className="row mx-2 my-2 g-4">

                <div className="d-flex justify-content-between align-items-center me-3 ">
                <div>
                    <h5 className="mb-1">Groups</h5>
                    <p className="text-muted mb-0">
                        Select a Groups to view.
                    </p>
                </div>

                

                 <button type="button" className="btn text-white "  
                                    style={{
                                    backgroundColor: "#244B9B",
                                    minHeight: "38px",
                                    whiteSpace: "nowrap",
                                    }}
                                    onClick={handleOpenCreateModal}
                                    disabled={loadingMembers}
                                >
                                    {loadingMembers ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Loading...
                                    </>
                                    ) : (
                                    <>
                                        <i className="bi bi-plus-lg "></i>
                                        
                                    </>
                                    )}
                                </button>
            </div>

              

            {groups && groups.length > 0 ? ( groups.map((group) => (

                <div  className="col-12 col-md-4 col-lg-3" key={group.id} >
                    <GroupCard
                    group={group}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                    />
                </div>
                ))
            ) : (
                <div className="col-12 text-center py-5">
                <i className="bi bi-people fs-1 text-secondary"></i>

                <h5 className="mt-3 fw-bold">
                    No Groups Found
                </h5>

                <p className="text-secondary">
                    Create a group to start sharing expenses.
                </p>

                <button type="button" className="btn text-white px-4" style={{ backgroundColor: "#244B9B" }} onClick={handleOpenCreateModal}>
                    <i className="bi bi-plus-lg me-2"></i>
                    Create Your First Group
                </button>
                </div>
            )}

            </div>

            
            <CreateGroupModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                members={members}
                onCreate={handleCreateGroup}
                loading={creating || loadingMembers}
            />

           
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
                message="Are you sure you want to delete this group? "
                onCancel={() => setDeletingGroup(null)}
                onConfirm={handleDeleteGroup}
                loading={deleting}
            />

        </div>
    );

    
}
