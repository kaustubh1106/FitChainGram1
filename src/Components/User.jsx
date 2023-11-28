import React from 'react'
import { useState, useEffect } from 'react';
import image1 from '../assets/image.png'
import { Link } from 'react-router-dom';
const User = ({ Contract, Signer }) => {
    const [Myname, setMyname] = useState()
    const [userAddress, setUserAddress] = useState(null);
    const [follower, setfollower] = useState([]);
    const [ID, setID] = useState(null);
    const check = async () => {
        try {
            const username = document.getElementById("username").value
            await Contract.registerasUser(username)


        } catch (e) {
            alert("already have an account")
        }
    }

    useEffect(() => {
        if (Signer && Signer.address && Contract) {
            setUserAddress(Signer.address)
            console.log(userAddress)
            try {
                Contract.showusername(Signer.address)
                    .then((res) => {
                        setMyname(res[1])
                        setfollower(res[3])
                        setID(Number(res[0]))
                        console.log(follower)
                    })
                    .catch((error) => {
                        // Handle any errors that occur during the contract call
                        console.error("Error calling showusername:", error);

                        // Check if the error message contains "abc" to identify the specific error
                        if (error.message.includes("abc")) {
                            // Handle the "abc" error case
                            alert("you are an instrcutor");
                        } else {
                            // Handle other errors
                            alert("An error occurred while fetching user data");
                        }
                    });
            } catch (error) {
                console.error('Error fetching user data:', error);
                // You can set some state to indicate the error to the user
            }
        }

    }, [Signer, Contract]);




    return (

        <div>

            {Myname &&
                <>
                    
                    <div className="d-flex justify-content-center">
                        <div className="card " style={{ width: "18rem" }}>
                            <img src={image1} className="card-img-top" alt="..." />
                            <div className="card-body">
                                <p className="card-text">
                                    ID:{ID}<br />
                                    Username:{Myname}<br />
                                </p>
                            </div>
                        </div>
                    </div>
                    following:
                    <>
                        {follower.map((log) => (
                            <p key={log}>{log}</p>
                        ))}
                    </>
                    <h3>Post</h3>
                    <button type="button" className="btn btn-primary">
                        <Link to={"/Loginasinstructor/follow"} className='mylink'>follow</Link>
                    </button>
                    <button type="button" className="btn btn-primary">
                        <Link to={"/Loginasinstructor/chat"} className='mylink'>Connect with Instructors</Link>
                    </button>
                    <button type="button" className="btn btn-primary">
                        <Link to={"/Loginasuser/feed"} className='myfeed'>Feed</Link>
                    </button>
                </>
            }
            {
                !Myname &&
                <>
                    <div className="input-group mb-3">
                    <input
                        type="text"
                        id='username'
                        className="form-control"
                        placeholder="username"
                        aria-label="Recipient's username"
                        aria-describedby="button-addon2"
                    />
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        id="button-addon2"
                        onClick={check}
                    >
                        SignUp/LogIn
                    </button>
                    </div>
                    {/* <button type="button" className="btn btn-primary">
                        <Link to={"/Loginasinstructor"} className='mylink'>Login as user</Link>
                    </button> */}
                </>
            }
        </div>

    )
}

export default User