import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import {HiPencilAlt} from "react-icons/hi";

export default function EventList() {   
    return(
        <>
            <div className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
                <div>
                    <h2 className="font-bold text-2xl">Event Title</h2>
                    <div>
                        Event Description
                    </div>
                </div>
                <div className="flex gap-2">
                    <RemoveBtn />
                    <Link href="/editEvent/123">   
                        <HiPencilAlt size={24}/>
                    </Link>
                </div>
            </div>
        </>
    );
}   