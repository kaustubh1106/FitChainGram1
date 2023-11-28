import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios'
const Createpost = ({ Contract }) => {
    const [file, setfile] = useState(null);
    const createpost = async (e) => {
        e.preventDefault()
        try {
            //const cid = document.getElementById('pin').value;
            const cid = await uploadenctopinata(file);
            console.log(cid)
            await Contract.createpost(cid)
        } catch {
            alert("user can't post")
        }
    }
    const handleinput = (e) => {
        setfile(e.target.files[0])
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




    return (
        <div>
            <div className="d-flex justify-content-center">
                <div class="card">
                    
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">
                            Browse File you want to post
                        </label>
                        <input className="form-control" type="file" id="formFile" onChange={handleinput}/>
                        <button className="btn btn-outline-success" type="submit" onClick={createpost}>
                                Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Createpost