
import FormInput from "./common/FormInput";



export default function SplitTable({members = [],amount = 0,splitType,percentages = {},onPercentageChange})
{


    function money(value) {
        return Number(value ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 0,  maximumFractionDigits: 2,});
    }

    function formatPercentage(value) 
    {
        return Number(value ?? 0).toLocaleString("en-IN", {  minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }


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

     const totalShare = members.reduce( (total, member) => total + getShare(member), 0);


    return (
        <div className="mt-3">
             {members.length > 0 && (

                <>
                     <h5 className="fw-semibold mb-3">
                            Expense Split
                        </h5>

               

                
           
            <div   className="table-responsive border rounded-3"  style={{maxHeight: "320px", overflowY: "auto" }} >

                
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"   style={{ position: "sticky", top: 0,zIndex: 2}} >
                        <tr>
                            <th style={{ width: splitType === "PERCENTAGE" ? "40%" : "55%" }}>Participant</th>
                            {splitType === "PERCENTAGE" && (
                                <th style={{ width: "30%" }}>Percentage</th>
                            )}
                            <th className="text-end"  style={{ width: splitType === "PERCENTAGE" ? "30%" : "45%" }}>
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
                                    <td >
                                        <div className="input-group input-group-sm">
                                            <FormInput
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={percentages[member.value] ?? ""}
                                                onChange={event => onPercentageChange(member.value,event.target.value)}         
                                            />
                                            <span className="mt-2"> %</span>
                                        </div>
                                    </td>
                                )}

                                <td className="text-end text-nowrap">
                                    ₹{ money(getShare(member))}
                                </td>
                            </tr>
                        ))}

                       
                    </tbody>

                     <tfoot  className="table-light fw-bold" style={{  position: "sticky", bottom: 0,  zIndex: 2 }}  >
                        <tr>
                            <td>Total </td>
                            {splitType === "PERCENTAGE" && (
                                <td> 
                                    <span className={ totalPercentage === 100 ? "text-success" : "text-danger" }>
                                        {totalPercentage.toFixed(2)}%
                                    </span>
                                </td>
                            )}

                            <td className="text-end text-nowrap">
                                ₹{money(totalShare)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
             </>
             )}

            
        </div>
    );
}
