import React from 'react'
import { useState, useEffect } from 'react';
import Card from './Card';
import '../styles/createpost.css'
const Feed = ({Contract}) => {
    const [posts, setposts] = useState([])
    useEffect(() => {
        const showpost = async () => {
            try {
                const memo = await Contract.showpost()
                console.log(memo)
                setposts(memo)
            } catch {

            }
        }
        showpost()
    }, [Contract])
    return (
        <div>
            <div className='mycards'>
                {posts.map((item) => (<Card key={item.id} item={item} Contract={Contract} />))}
            </div>
        </div>
    )
}

export default Feed