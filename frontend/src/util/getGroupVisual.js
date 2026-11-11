import {Plane, Cake, House, Utensils, ShoppingBag, BriefcaseBusiness, Users, Clapperboard, Wallet, Car} from "lucide-react";

import plane from "../assets/goa-trip.png";
import bday from "../assets/birthday-bash.png";
import home from "../assets/flat-expenses.png";
import team from "../assets/office-team.png";
import road from "../assets/road-trip.png";
import college from "../assets/college-friends.png";
import w from "../assets/w.png"

const groupVisuals = [
    {
        keywords: ["goa", "trip", "travel", "vacation", "tour"],
        icon: Plane,
        image: plane,
        bg: "bg-primary-subtle",
        color: "text-primary"
    },
    {
        keywords: ["birthday", "party", "celebration"],
        icon: Cake,
        image: bday,
        bg: "bg-danger-subtle",
        color: "text-danger"
    },
    {
        keywords: ["home", "family", "house", "flat", "rent"],
        icon: House,
        image: home,
        bg: "bg-success-subtle",
        color: "text-success"
    },
    {
        keywords: ["road", "drive", "car"],
        icon: Car,
        image: road,
        bg: "bg-info-subtle",
        color: "text-info"
    },
    {
        keywords: ["office", "work", "project", "team"],
        icon: BriefcaseBusiness,
        image: team,
        bg: "bg-warning-subtle",
        color: "text-warning"
    },
    {
        keywords: ["college", "student", "study", "friends", "friend"],
        icon: Users,
        image: college,
        bg: "bg-primary-subtle",
        color: "text-primary"
    },
    {
        keywords: ["food", "dinner", "lunch", "restaurant"],
        icon: Utensils,
        image: w,
        bg: "bg-warning-subtle",
        color: "text-warning"
    },
    {
        keywords: ["shop", "shopping"],
        icon: ShoppingBag,
        image: w,
        bg: "bg-info-subtle",
        color: "text-info"
    },
    {
        keywords: ["movie", "entertainment"],
        icon: Clapperboard,
        image: w,
        bg: "bg-dark-subtle",
        color: "text-dark"
    }
];

export function getGroupVisual(name = "")
 {
    const groupName = name.toLowerCase();

    return groupVisuals.find(item => item.keywords.some(keyword => groupName.includes(keyword))
    ) || {
        icon: Wallet,
        image: w,
        bg: "bg-light",
        color: "text-secondary"
    };
}