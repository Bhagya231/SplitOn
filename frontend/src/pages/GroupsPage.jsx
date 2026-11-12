
import { useLoaderData, useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";
import EditGroupModal from "../components/EditGroupModal";
import DeleteConfirm from "../components/common/DeleteModal";
import GroupCard from "../components/GroupCard";

import Img from "../assets/loginbg.png";
import bg from "../assets/membersbg.png"
import CreateGroupModal from "../components/CreateGroupModal";
import api from "../util/Api";




   


export default function GroupsPage() 
{

    const data = useLoaderData();

    const [searchParams, setSearchParams] = useSearchParams();
    
    const PAGE_SIZE = 8;

    const [groups, setGroups] = useState(data.content || []);
    const [search, setSearch] = useState(searchParams.get("search") || "");

    const [totalPages, setTotalPages] = useState(data.totalPages || 0);
    const [totalElements, setTotalElements] = useState(data.totalElements || 0);

    const currentPage = data.number || 0;

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


    useEffect(() => {
        setGroups(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
    }, [data]);


    useEffect(() => {
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);

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

         setSearchParams({
            page: "0",
            size: String(PAGE_SIZE)
        });
    }


     function handleSearch() 
     {

        const params = new URLSearchParams();

        if (search.trim()) 
        {
            params.set("search", search.trim());
        }

        params.set("page", 0);
        params.set("size", PAGE_SIZE);

        setSearchParams(params);
    }

    function handlePageChange(pageNumber) {

        if (pageNumber < 0 || pageNumber >= totalPages) {
            return;
        }

        const params = new URLSearchParams(searchParams);

        params.set("page", String(pageNumber));
        params.set("size", String(PAGE_SIZE));

        setSearchParams(params);
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

        const newGroup = response.data;

        const matchesSearch =
            !search.trim() ||
            newGroup.name?.toLowerCase().includes(search.trim().toLowerCase());

        if (currentPage === 0 && matchesSearch) {

            setGroups(previous => [
                newGroup,
                ...previous
            ].slice(0, PAGE_SIZE));

            const updatedTotal = totalElements + 1;

            setTotalElements(updatedTotal);
            setTotalPages(Math.ceil(updatedTotal / PAGE_SIZE));
        }

        setShowCreateModal(false);
        setErrorMessage("");

        return true;

    } catch (error) {

        console.error("Failed to create group:", error.response?.data || error.message);

        setErrorMessage(
            error.response?.data?.message ||
            "Failed to create group. Please try again."
        );

        return false;

    } finally {
        setCreating(false);
    }
}


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


    async function handleDeleteGroup() {

        if (!deletingGroup) {
            return;
        }

        setDeleting(true);

        try {

            await api.delete(`/groups/${deletingGroup.id}`);

            const updatedTotal = Math.max(0, totalElements - 1);
            const updatedPages = Math.ceil(updatedTotal / PAGE_SIZE);

            setTotalElements(updatedTotal);
            setTotalPages(updatedPages);

            setGroups(previous =>
                previous.filter(group => group.id !== deletingGroup.id)
            );

            setDeletingGroup(null);
            setErrorMessage("");

            // If the current page no longer exists, go to the previous page.
            if (currentPage >= updatedPages && currentPage > 0) {

                const params = new URLSearchParams(searchParams);

                params.set("page", String(updatedPages - 1));

                setSearchParams(params);
            }

        } catch (error) {

            console.error("Failed to delete group:", error);

            setErrorMessage(
                error.response?.data?.message ||
                "Failed to delete group. Please try again."
            );

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

            
            <div  className="rounded-4 overflow-hidden mb-3 mx-3 my-1"
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

                    
                    <div className="mx-3 mt-3">
                        <div className="row g-3 align-items-center">

                            

                            
                            <div className="col-12 col-lg-8">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSearch();
                                }}>
                                    <div
                                        className="input-group rounded-pill overflow-hidden bg-white"
                                        style={{
                                            border: "1px solid #ced4da",
                                            minHeight: "46px"
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="form-control border-0 shadow-none ps-4"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search groups by name..."
                                        />

                                        
                                        {search.trim() && (
                                            <button
                                                type="button"
                                                className="btn bg-white border-0 px-2"
                                                onClick={handleClearSearch}
                                                title="Clear search"
                                            >
                                                <i className="bi bi-x-circle text-secondary"></i>
                                            </button>
                                        )}

                                        
                                        <button
                                            type="submit"
                                            className="btn text-white px-3 rounded-pill m-1"
                                            style={{
                                                backgroundColor: "#244B9B"
                                            }}
                                            
                                            title="Search groups"
                                        >
                                            <i className="bi bi-search me-1"></i>
                                        
                                        </button>
                                    </div>
                                </form>
                            </div>

                        
                            <div className="col-12 col-lg-4 d-flex justify-content-lg-end">
                                <button
                                    type="button"
                                    className="btn text-white rounded-pill px-4"
                                    style={{
                                        backgroundColor: "#244B9B",
                                        minHeight: "46px"
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
                                            <i className="bi bi-plus-lg me-2"></i>
                                            Create Group
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                                    

                    
                    

                    <div className="d-flex justify-content-between align-items-center me-3 ">
                        <div className="mt-3">
                  
                                <p className="text-light mb-0">
                                    Total Groups: {totalElements}
                                </p>
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


            {totalPages > 0 && (

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mx-3 my-4 gap-3">

                    <p className="text-secondary mb-0">
                        Page {currentPage + 1} of {Math.max(totalPages, 1)}
                    </p>

                     <nav aria-label="Group pagination">

                        <ul className="pagination mb-0">

                            <li className={`page-item ${data.first ? "disabled" : ""}`}>

                                <button className="page-link" disabled={data.first} onClick={() => handlePageChange(currentPage - 1)}>
                                    Previous
                                </button>

                            </li>


                            {Array.from({ length: totalPages },(_, index) => (
                                    <li key={index} className={`page-item ${currentPage === index ? "active" : ""}`}  >

                                        <button  className="page-link" onClick={() => handlePageChange(index)} >
                                            {index + 1}
                                        </button>

                                    </li>

                                )
                            )}


                            <li className={`page-item ${data.last ? "disabled" : ""}`}>

                                <button className="page-link" disabled={data.last} onClick={() => handlePageChange(currentPage + 1)} >
                                    Next
                                </button>

                            </li>

                        </ul>

                    </nav>

                </div>
            )}

            
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
