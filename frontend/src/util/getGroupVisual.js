import { Plane,  Cake, House, Utensils, ShoppingBag,  BriefcaseBusiness, Users,  Clapperboard, Wallet} from "lucide-react";

import plane from "../assets/goa-trip.png"




const groupVisuals = [
    {
        keywords: ["trip", "travel", "vacation", "tour"],
        icon: Plane,
        image: {plane},
        bg: "bg-primary-subtle",
        color: "text-primary"
    },
    {
        keywords: ["birthday", "party", "celebration"],
        icon: Cake,
        image: "/images/groups/birthday.png",
        bg: "bg-danger-subtle",
        color: "text-danger"
    },
    {
        keywords: ["home", "family", "house"],
        icon: House,
        image: "/images/groups/home.png",
        bg: "bg-success-subtle",
        color: "text-success"
    },
    {
        keywords: ["food", "dinner", "lunch", "restaurant"],
        icon: Utensils,
        image: "/images/groups/food.png",
        bg: "bg-warning-subtle",
        color: "text-warning"
    },
    {
        keywords: ["shop", "shopping"],
        icon: ShoppingBag,
        image: "/images/groups/shopping.png",
        bg: "bg-info-subtle",
        color: "text-info"
    },
    {
        keywords: ["office", "work", "project"],
        icon: BriefcaseBusiness,
        image: "/images/groups/work.png",
        bg: "bg-secondary-subtle",
        color: "text-secondary"
    },
    {
        keywords: ["friend", "friends"],
        icon: Users,
        image: "/images/groups/friends.png",
        bg: "bg-primary-subtle",
        color: "text-primary"
    },
    {
        keywords: ["movie", "entertainment"],
        icon: Clapperboard,
        image: "/images/groups/movie.png",
        bg: "bg-dark-subtle",
        color: "text-dark"
    }
];

export function getGroupVisual(name = "") {
    const groupName = name.toLowerCase();

    return groupVisuals.find(item =>
        item.keywords.some(keyword => groupName.includes(keyword))
    ) || {
        icon: Wallet,
        image: "/images/groups/default.png",
        bg: "bg-light",
        color: "text-secondary"
    };
}