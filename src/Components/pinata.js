// pinataService.js
import axios from 'axios';

const PINATA_API_BASE_URL = 'https://api.pinata.cloud/';
const API_KEY = 'e3b20c73419fea5c1e6c';
const API_SECRET_KEY = '03fa46ccfa545a5a0e8bd13e1b355d5f3a15d703e04137deaa0eb8f7c824aa37';

const axiosInstance = axios.create({
    baseURL: PINATA_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': API_KEY,
        'pinata_secret_api_key': API_SECRET_KEY,
    },
});

// Function to upload a file to Pinata
export const uploadFileToPinata = async (file) => {
    try {
        const timeStamp = Date.now()
        const randomString = Math.random().toString(36).substring(7)
        const fileName = `image_${timeStamp}_${randomString}.jpg`

        const formData = new FormData();
        formData.append('file', {
            uri: 'file:///Users/kaustubhsharma/Desktop/images.png',
            type: "image/jpg",
            name: fileName
        });

        const response = await axiosInstance.post('/pinning/pinFileToIPFS', formData);
        return response.data.IpfsHash; // CID of the uploaded file
    } catch (error) {
        console.error('Error uploading file to Pinata:', error);
        throw error;
    }
};
