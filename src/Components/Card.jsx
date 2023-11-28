import React from 'react'
import { useState, useEffect } from 'react';
const Card = ({ item, Contract }) => {
    const [id,setid] = useState()
    const [cid,setcid] = useState()
    const [nol,setnol] = useState()
    const [url,seturl] = useState()
    const [review,setreview] = useState()
    useEffect(() => {
        const fetchData = async () => {
          try {
            const _id = Number(await item[0]);
            const cid = await item[1];
            const nol = Number(await item[2]);
            const url = "https://white-uniform-mastodon-684.mypinata.cloud/ipfs/" + cid;
            const review =Number(await item[3])
            setid(_id);
            setcid(cid);
            setnol(nol);
            seturl(url);
            setreview(review);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, [item]);
      

    const likepost = async () => {
        try {
            await Contract.likepost(item[0]);
            
        } catch {
            alert("already liked");
        }
    }
    console.log(id)
    const upvote = async () => {
        try{
            await Contract.review(item[0],true)
        }
        catch(error){
            if(error.message.includes("message")){
                alert("can't review yourself")
            }
            else{
                alert("some error occured")
            }
        }
    }
    const downvote = async () =>{
        try{
            await Contract.review(item[0],false)
        }catch{
            console.log("error")
        }
    }
    
    

    return (

        <div>
            <div className="card" style={{ width: "18rem" }}>
                <img src={url} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">ID: {id} </h5>
                    <a className="btn btn-primary" onClick={likepost}>
                       ❤️ {nol}
                    </a>
                    <a className="btn btn-primary" onClick={upvote}>
                        ⬆️ {review}
                    </a>
                    <a  className="btn btn-primary" onClick={downvote}>
                        ⬇️
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Card