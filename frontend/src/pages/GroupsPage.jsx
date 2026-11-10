
import { useLoaderData } from "react-router-dom";

import Img from "../assets/loginbg.png";
import bg from "../assets/membersbg.png"
import { useState } from "react";
import FormInput from "../components/common/FormInput";
import Card from "../components/common/Card";

import {Plane, Cake, House, Utensils, ShoppingBag, BriefcaseBusiness,Users,Clapperboard,Wallet} from "lucide-react";

   


export default function GroupsPage() 
{

    const data = useLoaderData();

    const [groups, setGroups] = useState(data.content || []);

    const [search, setSearch] = useState("");


     function getGroupIcon(groupName ="")  
    {
        const name = groupName.toLowerCase();

        if (/trip|travel|vacation|tour/.test(name)) return Plane;
        if (/birthday|party|celebration/.test(name)) return Cake;
        if (/home|family|house/.test(name)) return House;
        if (/food|dinner|lunch|restaurant/.test(name)) return Utensils;
        if (/shop|shopping/.test(name)) return ShoppingBag;
        if (/office|work|project/.test(name)) return BriefcaseBusiness;
        if (/friend/.test(name)) return Users;
        if (/movie|entertainment/.test(name)) return Clapperboard;

        return Wallet;
    };


    async function handleSearch()
    {
        try {

            const response = await api.get("/groups", {
                params: {
                    search: search.trim(),
                    page: 0,
                    size: 5
                }
            });

            setGroups(response.data.content);
        } catch (error) {
            console.error("Error searching groups:", error);
        }
    };

    return (
        <div className="container-fluid  py-2" 
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}>

            
            <div className="rounded-4 overflow-hidden mb-4 mx-3 my-2"
                style={{
                    minHeight: "180px",
                    backgroundImage: `url(${Img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative"
                }}
            >
                <div className="h-100 d-flex flex-column justify-content-center p-4 p-md-5"
                    style={{
                        minHeight: "180px",
                        background: "linear-gradient(90deg, rgba(15,35,75,0.85), rgba(15,35,75,0.15))"
                    }}>
                    <h1 className="fw-bold text-white mb-2">
                        My Groups
                    </h1>

                    <p className="text-white mb-0">
                        Manage your groups and keep all your shared expenses
                        organized in one place.
                    </p>
                </div>
            </div>


        
            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3 mx-3">

                <div className="d-flex flex-grow-1 flex-column flex-sm-row align-items-sm-start gap-2">

                     <div className="flex-grow-1" style={{ maxWidth: "650px" }}>
                        <FormInput
                            name="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search groups by name..."
                        />
                    </div>

                    <button type="button" className="btn text-white px-4"   
                        style={{
                            backgroundColor: "#244B9B",
                            height: "38px",
                            whiteSpace: "nowrap"
                        }}
                        onClick={handleSearch}
                    >
                        <i className="bi bi-search me-2"></i>
                        Search
                    </button>

                </div>

                <div>
                    <button
                        type="button"
                        className="btn text-white px-4 w-100 w-lg-auto"
                        style={{
                            backgroundColor: "#244B9B",
                            minHeight: "38px",
                            whiteSpace: "nowrap"
                        }}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Create Group
                    </button>
                </div>

            </div>


            <div className="mb-3 mx-3">

                

                    <div>
                        <h4 className="fw-bold mb-1" style={{ color: "#172D62" }} >
                            Your Groups
                        </h4>

                        <p className="text-secondary mb-0">
                            Manage all your groups in one place.
                        </p>
                    </div> 

            

            </div>


            
            <div className="row mx-3 my-5">

                        {groups && groups.length > 0 ? (
                            groups.map((group) => (

                                <div className="col-12 col-md-6 col-lg-4" key={group.id}>

                                    <Card className="h-100">

                                    

                                       
                                        <div className="d-flex justify-content-between align-items-start mb-3">

                                            <div>
                                                <h5 className="fw-bold mb-1 text-dark">
                                                    {group.name}
                                                </h5>

                                                <p className="text-secondary small mb-0">
                                                    {group.description}
                                                </p>
                                            </div>

                                            <button type="button" className="btn btn-light btn-sm" title="Group options" >
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </button>

                                        </div>

                                        
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex align-items-center">
                                                {group.groupMembers?.slice(0, 4).map((item, index) => {
                                                    const name = item.memberName || "";

                                                    return (
                                                        <div
                                                            key={item.id}
                                                            title={name}
                                                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary bg-primary-subtle border border-2 border-white"
                                                            style={{
                                                                width: "36px",
                                                                height: "36px",
                                                                marginLeft: index === 0 ? "0" : "-12px",
                                                                zIndex: 4 - index,
                                                                fontSize: "13px",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            {name.charAt(0).toUpperCase()}
                                                        </div>
                                                    );
                                                })}

                                                {group.groupMembers?.length > 4 && (
                                                    <div
                                                        className="rounded-circle d-flex align-items-center justify-content-center bg-secondary-subtle text-secondary border border-2 border-white fw-semibold"
                                                        style={{
                                                            width: "36px",
                                                            height: "36px",
                                                            marginLeft: "-12px",
                                                            zIndex: 0,
                                                            fontSize: "12px"
                                                        }}
                                                    >
                                                        +{group.groupMembers.length - 4}
                                                    </div>
                                                )}
                                            </div>

                                            <span className="text-secondary small ms-2">
                                                {group.groupMembers?.length || 0} Members
                                            </span>
                                        </div>

                                        
                                        <div className="d-flex justify-content-between align-items-center border-top pt-3">

                                            <small className="text-secondary">
                                                Created: {group.createdAt ? new Date(group.createdAt).toLocaleDateString(): "-"}                                                    
                                            </small>

                                            <button type="button" className="btn btn-primary btn-sm">
                                                Open Group
                                                <i className="bi bi-arrow-right ms-2"></i>
                                            </button>

                                        </div>

                                    </Card>

                                </div>

                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <i className="bi bi-people fs-1 text-secondary"></i>
                                <h5 className="mt-3">No Groups Found</h5>
                                <p className="text-secondary">
                                    Create a group to start sharing expenses.
                                </p>


                                {/* <div className="col-12 text-center py-4">

                                    <img
                                        src="/images/no-groups.png"
                                        alt="No groups found"
                                        className="img-fluid mb-3"
                                        style={{ maxWidth: "280px", maxHeight: "200px" }}
                                    />

                                    <h5 className="fw-bold text-dark">
                                        No Groups Found
                                    </h5>

                                    <p className="text-secondary mb-3">
                                        You haven't joined any groups yet.
                                        Create your first group and start sharing expenses!
                                    </p>

                                    <button className="btn btn-primary px-4">
                                        <i className="bi bi-plus-lg me-2"></i>
                                        Create Your First Group
                                    </button>

                                </div> */}
                            </div>
                        )}

                    </div>






    </div>
    );
}
