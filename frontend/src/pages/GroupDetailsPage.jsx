
import { useState } from "react";
import { useLoaderData, Link,useNavigate,useRevalidator} from "react-router-dom";

import { ChevronRight, Home } from "lucide-react";


import bg from "../assets/membersbg.png";
import api from "../util/Api";

import GroupHeader from "../components/GroupHeader";
import FinancialOverview from "../components/FinancialOverview";
import GroupMembers from "../components/GroupMembers";
import ExpenseHistory from "../components/ExpenseHistory";
import AddMembersModal from "../components/AddMembersModal";


import EditGroupModal from "../components/EditGroupModal";
import DeleteConfirm from "../components/common/DeleteModal";

import { validateGroup } from "../util/validations";
import Button from "../components/common/Button";

export default function GroupDetailsPage() {

    const { group,expenses,expensePage,balances = [],totalExpenses = 0,currentMemberId } = useLoaderData();

    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const [editingGroup, setEditingGroup] = useState(null);
    const [deletingGroup, setDeletingGroup] = useState(null);
    const [removingMember, setRemovingMember] = useState(null);

    const [showAddMembers, setShowAddMembers] = useState(false);
    

    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [removing, setRemoving] = useState(false);
    

    const [errorMessage, setErrorMessage] = useState("");


    const currentBalance = balances.find(  item => item.memberId === currentMemberId );

    
   const membersWithBalances = (group?.groupMembers || []).map(member => {

        const balance = balances.find( item => item.memberId === member.memberId );

        return {
            ...member,
            paidAmount: balance?.totalPaid || 0,
            totalShare: balance?.totalShare || 0,
            balance: balance?.balance || 0,
            status: balance?.status || "SETTLED"
        };
    });

    function handleOpenEdit(selectedGroup) {
        setEditingGroup(selectedGroup);
    }

    function handleOpenDelete(selectedGroup) {
        setDeletingGroup(selectedGroup);
    }

    function handleOpenRemoveMember(member) {
        setRemovingMember(member);
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

        } catch (error) {
            console.error("Failed to update group:", error);

            setErrorMessage( error.response?.data?.message || "Failed to update group. Please try again." );

            return false;

        } finally {
            setUpdating(false);
        }
    }

    async function handleDeleteGroup() {
        if (!deletingGroup) return;

        setDeleting(true);

        try {
            await api.delete(`/groups/${deletingGroup.id}`);

            setDeletingGroup(null);
            setErrorMessage("");

            navigate("/app", { replace: true });

        } catch (error) {
            console.error("Failed to delete group:", error);

            setErrorMessage(  error.response?.data?.message || "Failed to delete group. Please try again.");

        } finally {
            setDeleting(false);
        }
    }

       function handleOpenAddExpense()
        {
            navigate(`/app/groups/${group.id}/expenses/add`);
        }

    async function handleRemoveMember() {
        if (!removingMember) return;

        setRemoving(true);

        try {
            await api.delete(  `/groups/${group.id}/members/${removingMember.memberId}`);

            setRemovingMember(null);
            setErrorMessage("");

            revalidator.revalidate();

        } catch (error) {
            console.error("Failed to remove member:", error);

            setErrorMessage( error.response?.data?.message || "Failed to remove member. Please try again.");
  
        } finally {
            setRemoving(false);
        }
    }

    // async function handleAddExpense(request) {
    //     setAddingExpense(true);

    //     try {
    //         await api.post( `/groups/${group.id}/expenses/add`,request);
  

    //         setShowAddExpense(false);
    //         setErrorMessage("");

    //         revalidator.revalidate();

    //         return true;

    //     } catch (error) {
    //         console.error("Failed to add expense:", error);

    //         setErrorMessage(error.response?.data?.message || "Failed to add expense. Please try again." );

    //         return false;

    //     } finally {
    //         setAddingExpense(false);
    //     }
    // }

    return (
        <div className="container-fluid py-2 px-0"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh"
            }}
        >
            <div className="container-fluid px-5 py-1 py-md-3">

                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb align-items-center mb-0">

                        <li className="breadcrumb-item">
                            <Link to="/app"  className="text-decoration-none text-muted d-inline-flex align-items-center gap-1"  >
                                <Home size={16} />
                                Groups
                            </Link>
                        </li>

                        <li className="d-flex align-items-center mx-2">
                            <ChevronRight size={14} className="text-muted" />
                        </li>

                        <li className="breadcrumb-item active text-truncate">
                            {group?.name}
                        </li>

                    </ol>
                </nav>

               
                {errorMessage && (
                    <div className="alert alert-danger alert-dismissible fade show">
                        {errorMessage}

                        <button type="button" className="btn-close" onClick={() => setErrorMessage("")} />
                    </div>
                )}

                
                <GroupHeader
                    group={group}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                />

               
                <section className="mt-4">
                    <FinancialOverview
                        totalExpenses={totalExpenses}
                        yourContribution={currentBalance?.totalPaid || 0}
                        yourBalance={currentBalance?.balance || 0}
                        onViewBalance={() => navigate(`/groups/${group.id}/balance`) }
                        onAddExpense={handleOpenAddExpense}
                    />
                </section>

                
                <section className="mt-4 ">
                    <GroupMembers
                        members={membersWithBalances}
                        onAddMember={() => setShowAddMembers(true)}
                        onRemoveMember={handleOpenRemoveMember}
                    />
                </section>

                
                <section className="mt-4">
                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body p-3 p-md-4">

                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">

                                <div>
                                    <h5 className="fw-bold mb-1">
                                        Expense History
                                    </h5>

                                    <p className="text-muted small mb-0">
                                        Track all expenses in this group
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={handleOpenAddExpense} >
                                    + Add Expense
                                </Button>

                            </div>

                            <ExpenseHistory
                                expenses={expenses || []}
                                groupId={group.id}
                                onAddExpense={handleOpenAddExpense}
                                
                            />

                        </div>
                    </div>
                </section>

                
                <EditGroupModal
                    show={Boolean(editingGroup)}
                    group={editingGroup}
                    onClose={() => setEditingGroup(null)}
                    onUpdate={handleUpdateGroup}
                    loading={updating}
                    validateGroup={validateGroup}
                />

              
                <AddMembersModal
                    show={showAddMembers}
                    groupId={group.id}
                    onClose={() => setShowAddMembers(false)}
                    onAdded={() => revalidator.revalidate()}
                />

                
                {/* <Modal
                    show={showAddExpense}
                    onHide={() => { if (!addingExpense) setShowAddExpense(false);}}
                    centered
                    size="lg"
                    backdrop={addingExpense ? "static" : true}
                >
                    <Modal.Header closeButton={!addingExpense}>
                        <Modal.Title>Add Expense</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <AddExpense
                            members={group.groupMembers || []}
                            onAddExpense={handleAddExpense}
                            onCancel={() => setShowAddExpense(false)}
                        />
                    </Modal.Body>
                </Modal> */}

                
                <DeleteConfirm
                    show={Boolean(deletingGroup)}
                    title="Delete Group"
                    itemName={deletingGroup?.name}
                    message="Are you sure you want to delete this group?"
                    onCancel={() => setDeletingGroup(null)}
                    onConfirm={handleDeleteGroup}
                    loading={deleting}
                />

                
                <DeleteConfirm
                    show={Boolean(removingMember)}
                    title="Remove Member"
                    itemName={removingMember?.memberName}
                    message="Are you sure you want to remove this member from the group?"
                    onCancel={() => setRemovingMember(null)}
                    onConfirm={handleRemoveMember}
                    loading={removing}
                />

            </div>
        </div>
    );
}
