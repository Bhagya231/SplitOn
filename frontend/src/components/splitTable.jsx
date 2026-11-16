
import FormInput from "./common/FormInput";



export default function SplitTable({members = [],amount = 0,splitType,percentages = {},onPercentageChange})
{


    const totalPercentage = members.reduce((total, member) =>total + (Number(percentages[member.value]) || 0),0 );

    function getShare(member) 
    {
        const totalAmount = Number(amount) || 0;

        if (splitType === "EQUAL") 
        {
            return members.length ? totalAmount / members.length : 0;
        }

        return totalAmount * (Number(percentages[member.value]) || 0) / 100;
    }

    return (
        <div className="mt-3">
            <div   className="table-responsive border rounded-3"  style={{maxHeight: "320px", overflowY: "auto",overflowX: "auto" }} >
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"   style={{ position: "sticky", top: 0,zIndex: 2}} >
                        <tr>
                            <th style={{ minWidth: "180px" }}>Participant</th>
                            {splitType === "PERCENTAGE" && (
                                <th style={{ minWidth: "130px" }}>Percentage</th>
                            )}
                            <th className="text-end" style={{ minWidth: "120px" }}>
                                Share
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {members.map(member => (
                            <tr key={member.value}>
                                <td className="text-break" style={{ maxWidth: "220px" }}>
                                    {member.label}
                                </td>

                                {splitType === "PERCENTAGE" && (
                                    <td>
                                        <div className="input-group input-group-sm">
                                            <FormInput
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                max="100"
                                                step="any"
                                                value={percentages[member.value] ?? ""}
                                                onChange={event => onPercentageChange(member.value,event.target.value)}
                                                    
                                                        
                                            />
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </td>
                                )}

                                <td className="text-end text-nowrap">
                                    ₹{getShare(member).toFixed(2)}
                                </td>
                            </tr>
                        ))}

                        {members.length === 0 && (
                            <tr>
                                <td
                                    colSpan={splitType === "PERCENTAGE" ? 3 : 2}
                                    className="text-center text-muted py-4"
                                >
                                    Select participants to see the split.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {splitType === "PERCENTAGE" && (
                <div className="d-flex justify-content-between mt-3">
                    <span className="text-muted">Total percentage</span>
                    <strong>{totalPercentage.toFixed(2)}%</strong>
                </div>
            )}
        </div>
    );
}
