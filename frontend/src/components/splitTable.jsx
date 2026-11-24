

import FormInput from "./common/FormInput";
import { RefreshCw } from "lucide-react";
import Button from "./common/Button";



export default function SplitTable({members = [],amount = 0,splitType,manualPercentages = {},editingPercentages = {},percentages = {},payerId,onPercentageChange,onSplitEqually,
            amounts = {}, manualAmounts = {},editingAmounts = {},onAmountChange})           
{


    function money(value) 
    {
        return Number(value ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 0,  maximumFractionDigits: 2,});
    }

    function formatPercentage(value) 
    {
        return Number(value ?? 0).toLocaleString("en-IN", {  minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    

    const totalPercentageUnits = members.reduce((total, member) => total + Math.round( (Number(percentages[member.value]) || 0) * 100 ),0);

    const totalPercentage = totalPercentageUnits / 100;

    const isPercentageInvalid = totalPercentageUnits !== 10000;

    const hasManualChanges = splitType === "EQUAL" ? Object.keys(manualAmounts).length > 0 : Object.keys(manualPercentages).length > 0;
    
    

   function getShare(member) 
   {

        if (splitType === "EQUAL") 
        {
            return (amounts[member.value] ?? 0) / 100;
        }

        return (
            (Number(amount) || 0) * (Number(percentages[member.value]) || 0) / 100
        );
    }

     const totalShare = members.reduce( (total, member, index) => total + getShare(member, index),0 );


    return (
        <div className="mt-4">
             {members.length > 0 && (

                <>
                    <div className="d-flex  align-items-center justify-content-between mb-3">

                        <h5 className="fw-semibold mb-2">
                            Expense Split
                        </h5>

                            <Button variant="white" className= {`btn btn-sm  d-flex align-items-center gap-1 ${hasManualChanges ? "btn-outline-primary" : "btn-light text-secondary"}`} 
                                disabled={!hasManualChanges} onClick={onSplitEqually} >
                                
                                <RefreshCw size={14} />
                                <span>Split Equally</span>
                            </Button>

                        

                    </div>
                   

           
            <div   className="table-responsive border rounded-3"  style={{maxHeight: "320px", overflowY: "auto" }} >

                
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"   style={{ position: "sticky", top: 0,zIndex: 0}} >
                        <tr>
                            <th style={{ width: splitType === "PERCENTAGE" ? "40%" : "55%" }}>Participant</th>
                            {splitType === "PERCENTAGE" && (
                                <th style={{ width: "30%" }}>Percentage</th>
                            )}
                            <th className="text-end"  style={{ width: splitType === "PERCENTAGE" ? "10%" : "7%" }}>
                                Share
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {members.map((member,index) => {

                            const isPayer = member.value === payerId;


                            console.log("member", member.value , " payer",payerId );

                            console.log("is payer",isPayer);

                            const isManual = Object.hasOwn(manualPercentages, member.value);

                            const percentage = Number(percentages[member.value]) || 0;

                            const isAutomaticZero = !isManual && percentage === 0;
                            const isAutomaticZeroValue =  !isManual && amount === 0;

                        

                            return (

                                <tr key={member.value}>

                                    <td className="text-break" style={{ maxWidth: "220px" }}>
                                      <div className="d-flex align-items-center gap-2">
                                            <span>{member.label}</span>

                                            {isPayer && (
                                                <span className="badge bg-primary-subtle text-primary rounded-pill">
                                                    Payer
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {splitType === "PERCENTAGE" && (
                                        <td >
                                            {/* <div className="input-group input-group-sm"> */}
                                            <div className="position-relative" style={{ width: "75px" }}>
                                                <FormInput
                                                    type="number"
                                                    className={`form-control form-control-sm pe-4  no-spinner ${ isAutomaticZeroValue ? "bg-light text-secondary" : "" }`}
                                                    
                                                    min="0"
                                                    margin="mb-0"
                                                    max="100"
                                                    step="0.01"
                                                    value={
                                                        Object.hasOwn(editingPercentages, member.value)
                                                            ? editingPercentages[member.value]
                                                            : percentages[member.value] ?? ""
                                                    }
                                                    onChange={event => onPercentageChange(member.value,event.target.value)}          
                                                />
                                                <span className={`position-absolute top-50 end-0 translate-middle-y pe-2 text-muted ${isAutomaticZero ? "bg-light text-secondary" : ""} `} style={{ pointerEvents: "none" }}> %</span>

                                            </div>
                                        </td>
                                    )}

                                    
                                    <td className="text-end text-nowrap">

                                         {splitType === "EQUAL" ? (

                                            <FormInput
                                                type="number"
                                                min="0"
                                                className={`form-control form-control-sm  no-spinner ${ isAutomaticZero ? "bg-light text-secondary" : "" }`}
                                                step="0.01"
                                                margin="mb-0"
                                                value={ Object.hasOwn(editingAmounts, member.value) ? editingAmounts[member.value] : ((amounts[member.value] ?? 0) / 100)}
                                                onChange={event =>  onAmountChange(member.value, event.target.value) }
                                            />

                                         ) : (
                                            `₹${money(getShare(member))}`
                                         ) }
                        


                                    </td>
                                     
                                    

                                    {/* <td className="text-end text-nowrap">
                                        ₹{money(getShare(member,index))}
                                    </td> */}

                                </tr>
                            );
                         })}

                 </tbody>
                            

                     <tfoot  className="table-light fw-bold" style={{  position: "sticky", bottom: 0,  zIndex: 0 }}  >
                        <tr>
                            <td>Total </td>
                            {splitType === "PERCENTAGE" && (
                                <td> 
                                    <span className={ !isPercentageInvalid  ? "text-success" : "text-danger" }>
                                        {formatPercentage(totalPercentage)}%
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

                

            {splitType === "PERCENTAGE" && isPercentageInvalid && (
                    <div className="text-danger small mt-2">
                        
                        {totalPercentageUnits > 10000 ? "Total percentage cannot exceed 100%." : "Total percentage must equal 100%."}
                            
                            
                    </div>
                )}

             </>
             )}

            
        </div>
    );
}
