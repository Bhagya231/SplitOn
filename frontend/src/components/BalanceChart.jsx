
import { Card } from "react-bootstrap";

import { Bar,BarChart,XAxis, YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Cell,LabelList } from "recharts";


function BalanceChart({members = []})
{

    const chartWidth = Math.max(members.length * 100, 320);

    console.log("members ",members);

    return (


        <Card  className="p-3"  >
            

            <div style={{width: "100%", overflowX: "auto", overflowY: "hidden"}}>

                <div style={{ width: `${chartWidth}px`, height: 380}}>

                    <ResponsiveContainer width="100%" height="100%" >
                        <BarChart data={members} barCategoryGap="45%" margin={{ top: 35, right: 20, left: 15, bottom: 30 }}  >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf5"/>
                            <XAxis dataKey="memberName" axisLine={false} tickMargin={20} angle={-25} tickLine={false} height={60}    />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                            <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Net Balance"]} />
                            <Bar dataKey="balance" barSize={55}  radius={[4,4,0,0]} >

                                
                                {members.map((member,index) => (
                                    <Cell key={`cell-${index}`}
                                    fill={member.balance >= 0 ? "#28c76f" : "#ff5b5b"} />
                                ))}

                                <LabelList dataKey="balance" offset={10} position="top" formatter={(value) => `₹${value.toLocaleString("en-IN")}`}/>

                            </Bar>


                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </Card>
    )

}


export default BalanceChart;