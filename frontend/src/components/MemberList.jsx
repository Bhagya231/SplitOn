
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import DeleteConfirm from './common/DeleteModal';
import Button from './common/Button';
import img from "../assets/NoMembers.png"

function MemberList({ members =[], onDeleteMember, deleting =false })
{
    
    const [selectedMember, setSelectedMember] = useState(null);
    async function handleConfirmDelete()
    {
        if(!selectedMember)
        {
            return;
        }

        const res = await onDeleteMember(selectedMember.id);
        if(res)
        {
            setSelectedMember(null);
        }
    }
    
    if (members.length === 0)
    {
        return (
             <div className="text-center py-4 border ">
                        <img
                            src={img}
                            alt="No members"
                            className="empty-state-image" width="550" height="250"
                        />
                        
                        
                    </div>
        )
    }

  return (
    <>
    <div className="table-responsive mx-4">
      <table className="table table-bordered table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="text-center">S.No</th>
            <th className="text-center">Name</th>
            <th className="text-center">Email</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member, index) => (
            <tr key={member.id}>
              <td className="text-center">{index + 1}</td>
              <td className="text-center">{member.name}</td>
              <td className="text-center">{member.email}</td>
              <td className="text-center">
                <Button   type="button"  className="btn btn-sm btn-outline-danger" aria-label={`Delete ${member.name}`}
                    onClick={() => setSelectedMember(member)} >
                    
                  <Trash2 size={20}  />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

     <DeleteConfirm
        show={selectedMember !== null}
        title="Delete Member"
        itemName={selectedMember?.name}
        message="Are you sure you want to delete this member?"
        onCancel={() => setSelectedMember(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
    />

    </>
  );
}

export default MemberList;