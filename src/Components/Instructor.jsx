import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios'
import image1 from '../assets/image.png'
import image2 from '../assets/QR1.png'
import image3 from '../assets/Qr2.png'
import '../styles/instructor.css'
import { Link } from 'react-router-dom'
import '../styles/createpost.css'

const Instructor = ({ Contract, Signer }) => {
    //--------------------->veridoc part
    const [uniqueId, setuniqueId] = useState('')
    const [qrImage, setqrImage] = useState('')
    const [username, setusername] = useState('')
    const [fileHash, setFileHash] = useState('')
    const [link, setlink] = useState('')
    const [qr1, setqr1] = useState(null);
    let img
    const generateCode = async () => {
        try {
            const url = 'http://10.12.1.155:3000/api/generateQR'

            // const headers = {
            //     'Content-Type': 'application/x-www-form-urlencoded',
            //     'apikey': 'A135C91A4D4D8D94F8B96818508CB6B23108C6796C181417A8ECD4AB7CFCCE14',
            //     'payload': '7d3b9f69feea2d2554f5b32777cbc12ef995665cda6c4117bcbf6b07dd6d831c',
            // }

            const response = await fetch(url, {
                method: 'POST',
                //headers: headers,
                //mode:'no-cors'
            });

            if (response.status === 200) {
                const data = await response.json();
                //console.log(JSON.stringify(data))
                //setuniqueId(JSON.stringify(data.data.uniqueId))
                setuniqueId(data.data.uniqueId)
                console.log(data)
                console.log(uniqueId)
                setqrImage(data.data.qrimage);
                const cid1 = await downloadImage(data.data.qrimage)
                setqr1(cid1)

            } else {
                console.log("API called failed", response.returncode)
                //setResponseText('API call failed');
            }
        } catch (err) {
            console.error(err)
        }

    }

    const uploadenctopinata = async (file) => {
        try {
            const formData = new FormData();
            // const uniqueName = `file_${Data.now()}_${file.name}`
            formData.append("file", file);
            console.log("ok")
            const response = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        pinata_api_key: `a505e3a50bf7a498bef1`,
                        pinata_secret_api_key: `4c77af20022279f7b8a89f9601a88380e09a484a014f6636b88728813647defc`,
                    },
                }
            );
            return response.data.IpfsHash
            //console.log("File uploaded to Pinata:", response.data.IpfsHash);
        } catch (error) {
            console.error("Error uploading file to Pinata:", error);
        }

    }


    async function downloadImage(imageUrl) {
        try {
            // Fetch the image from the URL
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const cid = await uploadenctopinata(blob)
            return cid;
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    }

    //console.log(qr1)
    const documentSubmission = async () => {
        // await generateCode()

        if (uniqueId && qrImage) {
            try {

                const url = 'http://10.12.1.155:3000/api/uploadFile'
                // const link2 = "https://drive.google.com/file/d/1okcfoTatk1gdDKKHVQrQ_tBCvnd2g8Pt/view?usp=drivesdk"
                const id = link.split("/");
                console.log(id)
                const headers = {
                    'Content-Type': 'application/json',
                }
                const requestBody = {
                    "uniqueId": `${uniqueId}`,
                    // https://drive.google.com/open?id=15LuC9b2vK0GS7ykydRvx_1NSmg9mY8oU
                    "fileUrl": `https://drive.google.com/open?id=${id[5]}`
                }

                const response = await fetch(url, {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify(requestBody)
                })

                if (response.status === 200) {
                    const data = await response.json();
                    console.log(JSON.stringify(data));
                    console.log("File Hash: ", data.data)
                    setFileHash(data)
                    try {
                        //const username = document.getElementById("username").value
                        await Contract.registerasInstructor(username, data.data, qr1)
                    } catch (e) {
                        alert("already have an account")
                    }

                } else {
                    console.log("API call failed");
                    // setResponseText('API call failed');
                }
            } catch (err) {
                console.error(err)
            }
        } else {
            alert("try again")
        }
    }


    //--------------------->end
    console.log(Contract)
    const [Myname, setMyname] = useState()
    const [userAddress, setUserAddress] = useState(null);
    const [follower, setfollower] = useState(null);
    const [post, setpost] = useState(null);

    const check = async () => {
        // try {
        //     const username = document.getElementById("username").value
        //     await Contract.registerasInstructor(username,fileHash)
        // } catch (e) {
        //     alert("already have an account")
        // }
    }
    useEffect(() => {
        try {

            if (Signer && Signer.address && Contract) {
                if (Contract.showinstructor(Signer.address)) {
                    const memo = Contract.showinstructor(Signer.address)
                    memo.then((res) => {
                        const post = Number(res[5])
                        const follower = Number(res[3])
                        setqr1(res[8])
                        setMyname(res[1])
                        setfollower(follower)
                        setpost(post)
                    })
                    setUserAddress(Signer.address);

                }
            }
        } catch {
            alert("hii")
        }
        const storedQrImage = localStorage.getItem('qrImage');
        if (storedQrImage) {
            setqrImage(storedQrImage);
        }

        // Set userAddress when Signer is available

    }, [Signer], Contract);

    return (
        <div>
            {Myname &&
                <>
                    <div>

                        {/* <div className="input-group mb-3">
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
                        </div> */}
                        <div className="d-flex justify-content-center">
                            <div className="card " style={{ width: "18rem" }}>
                                {/* <img src={qrImage} className="card-img-top" alt="..." />
                                function imageLoader(qrImage) {
                                    <img src={qrImage} className="card-img-top" alt="..." />
                                } */}
                                <img src={`https://white-uniform-mastodon-684.mypinata.cloud/ipfs/${qr1}`} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <p className="card-text">
                                        <h2>Instructor</h2>

                                        <h5>Username:</h5>{Myname}<br />
                                        <h5>Address:</h5> {userAddress || "Loading..."}<br />
                                        <h5>  Follower:</h5> {follower}<br />
                                        <h5> Post:</h5> {post}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <button type="button" className="btn btn-primary">
                        <Link to={"/Loginasuser/createpost"} className='mylink'>create post</Link>
                    </button>
                    <button type="button" className="btn btn-primary">
                        <Link to={"/Loginasuser/feed"} className='myfeed'>Feed</Link>
                    </button>
                    <button type="button" className="btn btn-primary">
                        <Link to={"/Loginasuser/chat"} className='mylink'>Connections</Link>
                    </button></>}
            {
                !Myname &&
                <>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            id='username'
                            className="form-control"
                            placeholder="enter username"
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            onChange={(e) => { setusername(e.target.value) }}
                        />
                        <br />
                        <input
                            type="text"
                            id='link'
                            className="form-control"
                            placeholder="enter your certificate's google drive link"
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            onChange={(e) => { setlink(e.target.value) }}
                        />
                        <br />
                {   !qr1 ?     <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                            onClick={() => {
                                generateCode()

                            }}
                        >
                            verify Document
                        </button>
                        :<button type="button" class="btn btn-outline-secondary" disabled>Verified</button>}
                        {qr1?<button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                            onClick={() => {
                                documentSubmission()
                                check()

                            }}
                        >
                            SignUp/LogIn
                        </button>:<button type="button" class="btn btn-outline-secondary" disabled>Verify document first</button>}
                    </div>
                </>
            }
        </div>

    )
}

export default Instructor