import React from 'react'

const Follow = ({Contract,Signer}) => {
    const follow = async(e)=>{
        e.preventDefault()
        try{
            const address = document.getElementById("pin").value
            console.log(address)
            await Contract.follow(address)
            alert("done")}
        catch(error){
            if (error.message.includes("only user can follow")) {
                alert("only user can follow");
            } else if(error.message.includes("only instructor can be followed")) {
                alert("only instructor can be followed");
            }
            else if(error.message.includes("already following")){
                alert("already following")
            }
            else{
                alert("some error occured")
            }
        }
    }
  return (
    <div>
        <div className="d-flex justify-content-center">
            <div class="card">
                <div class="card-body">
                    Enter the address of the instructor you want to follow
                    <form className="d-flex" role="search">
                        <input
                            id='pin'
                            className="form-control me-2"
                            type="search"
                            placeholder="Enter the address"
                            aria-label="Search"
                        />
                        <button className="btn btn-outline-success" type="submit" onClick={follow}>
                            Follow
                        </button>
                    </form>
                </div>
            </div>
            </div>
    </div>
  )
}

export default Follow