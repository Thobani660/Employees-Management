import Asidebox from "./asidebox";
import { useState } from "react";

function Aside(){

    const [reload, setReload] = useState(true);

    // let newData = JSON.parse(localStorage.getItem("bookTable"));
    // console.log(newData,"this is library")



    let profileDisplay = localStorage.getItem("formData");
    // console.log(profileDisplay,"size ngomsebenzi")

    return(
<>
<div className="aside">
                <div className="top1">
                <div className='top'><span className="iconamoon--profile-fill"></span></div></div>
                   
                    {/* {newData.map((Trial, index) => ( */}
                   <Asidebox Displaying={profileDisplay}/>
                {/* ))} */}
            </div>
            {/* </div> */}
</>
    )
}export default Aside;