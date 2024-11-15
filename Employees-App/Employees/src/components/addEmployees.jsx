// export function addBook(formData){
// //    console.log(formData, "hi")

//     let adding = JSON.parse(localStorage.getItem("formData")); 
//     adding.push(formData);
//     localStorage.setItem("formData", JSON.stringify(adding));
//     console.log(adding,"this")
    
// }

export function addBook(formData) {
    // console.log(formData,"lllllllll")
    // localStorage.getItem("formData");
    
    const passing =  JSON.parse(localStorage.getItem("formData"));
    passing.push(formData)

    localStorage.setItem("formData",JSON.stringify(formData)) ;
    console.log(passing,"hello")
    // let adding = existingData ? JSON.parse(existingData) : [];

    // adding.push(formData);
    // localStorage.setItem("formData", JSON.stringify(formData));
    // console.log(adding, "this");
}













































