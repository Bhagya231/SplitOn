
import { useEffect, useState } from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import { Search, Users, UserRound } from "lucide-react";
import api from "../util/Api";
import Button from "./common/Button";
import Pic from "../assets/NoM.png"

export default function AddMembersModal({
    show,
    groupId,
    onClose,
    onAdded
}) {
    const PAGE_SIZE = 5;

    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!show || !groupId) return;

        fetchAvailableMembers();
    }, [show, groupId, page, appliedSearch]);

    async function fetchAvailableMembers() {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await api.get(`/groups/${groupId}/available`,
                {
                    params: {
                        search: appliedSearch,
                        page,
                        size: PAGE_SIZE
                    }
                }
            );

            setMembers(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);

        } catch (error) {
            console.error("Failed to fetch available members:", error);

            setErrorMessage( error.response?.data?.message ||"Failed to load available members.");
        } finally {
            setLoading(false);
        }
    }

    function handleSearch(event) {
        event.preventDefault();

        setPage(0);
        setAppliedSearch(search.trim());
        setSelectedMembers([]);
    }

    function handleSelectMember(memberId) {
        setSelectedMembers(previous =>
            previous.includes(memberId) ? previous.filter(id => id !== memberId) : [...previous, memberId]);
    }

    function handleClearSearch() 
    {
        setSearch("");
        setAppliedSearch("");
        setPage(0);
        setSelectedMembers([]);
    }

    function handleClose() 
    {
        if (adding) return;

        setMembers([]);
        setSelectedMembers([]);
        setSearch("");
        setAppliedSearch("");
        setPage(0);
        setErrorMessage("");

        onClose();
    }

    async function handleAddMembers() 
    {
        if (selectedMembers.length === 0) return;

        setAdding(true);
        setErrorMessage("");

        try {
            const request = selectedMembers.map(memberId => ({memberId }));

            await api.post( `/groups/${groupId}/members`,request );

            setSelectedMembers([]);

            await onAdded?.();

            handleClose();

        } catch (error) {
            console.error("Failed to add members:", error);

            setErrorMessage( error.response?.data?.message ||"Failed to add members. Please try again." );
        } finally {
            setAdding(false);
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered backdrop={adding ? "static" : true} keyboard={!adding}>

            <Modal.Header closeButton={!adding}>
                <Modal.Title className="fw-bold">
                    <Users size={22} className="me-2 text-primary" />
                    Add Group Members
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-3 p-md-4">

                <p className="text-secondary mb-3">
                    Select members you want to add to this group.
                </p>


                {errorMessage && (
                    <div className="alert alert-danger py-2">
                        {errorMessage}
                    </div>
                )}


                
               <div className="mb-3">
                    <Form onSubmit={handleSearch}>
                        <div  className="input-group rounded-pill overflow-hidden bg-white"
                            style={{
                                border: "1px solid #ced4da",
                                minHeight: "46px"
                            }} >
                            <input type="text"                                
                                className="form-control border-0 shadow-none ps-4"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search members by name or email..."
                            />

                           {search.trim() && (
                                <Button                                                 
                                    className="btn bg-white border-0 px-2"
                                    onClick={handleClearSearch}
                                    title="Clear search"
                                >
                                    <i className="bi bi-x-circle text-secondary"></i>
                                </Button>
                            )}

                            <Button type="submit" className="btn text-white px-3 rounded-pill m-1"  title="Search groups" >
                                <i className="bi bi-search me-1"></i>
                            
                            </Button>
                        </div>
                    </Form>
                </div>

                
               
                <div className="border rounded-3 overflow-hidden">

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="text-secondary mt-2 mb-0">
                                Loading members...
                            </p>
                        </div>
                    ) : members.length > 0 ? (
                        members.map(member => {
                            const selected = selectedMembers.includes(member.id);

                            return (
                                <label  key={member.id} className={`d-flex align-items-center gap-3 p-3 border-bottom ${selected ? "bg-primary-subtle" : "bg-white" }`}
                                    style={{ cursor: "pointer" }} >
                                    <Form.Check type="checkbox" checked={selected}
                                        onChange={() =>  handleSelectMember(member.id) }
                                    />

                                    <div   className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{ width: 44, height: 44 }} >
                                        <UserRound size={23} />
                                    </div>

                                    <div className="flex-grow-1 min-w-0">
                                        <h6 className="fw-semibold mb-1 text-truncate">
                                            {member.name}
                                        </h6>

                                        <small className="text-secondary text-truncate d-block">
                                            {member.email}
                                        </small>
                                    </div>
                                </label>
                            );
                        })
                    ) : (
                        <div className="text-center py-5">
                            {/* <Users  size={35} className="text-secondary mb-2" /> */}
                      
                            <img src={Pic} alt="No expenses found"  
                                    style={{
                                        width: "100%",
                                        maxWidth: "380px",
                                        height: " 100px",
                                        objectFit: "contain"
                                    }}
                                />

                            <h6 className="fw-semibold">
                                No available members
                            </h6>

                            <p className="text-secondary small mb-0">
                                No members found for this search.
                            </p>
                        </div>
                    )}
                </div>

                
                {!loading && totalPages > 1 && (
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page === 0}
                            onClick={() => setPage(previous => previous - 1)}
                        >
                            Previous
                        </button>

                        <small className="text-secondary">
                            Page {page + 1} of {totalPages}
                        </small>

                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(previous => previous + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}

            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <small className="text-secondary">
                    {selectedMembers.length} selected
                </small>

                <div className="d-flex gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={adding}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleAddMembers}
                        loading={adding}
                        disabled={adding || selectedMembers.length === 0}
                    >
                        Add Members
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
