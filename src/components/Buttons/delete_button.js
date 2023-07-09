import React from 'react';
import axios from 'axios';
import './button.css'

const DeleteFile = ({fileName, token}) => {

    const payload = {file: fileName, token: token}
    const deleteFile = () =>{
       handleDelete();
    }

    async function handleDelete(){
        axios.delete('https://bgt8168cpa.execute-api.eu-north-1.amazonaws.com/dev/files',{data: payload}
        )
        .then((response) => {
            if(response.ok){
                console.log("good")
                window.location.reload();
            }
            else{
                console.log("failed")
                window.location.reload();
            }
        })
        .catch((error) =>{
            console.log(error)
        })
    }

    return(
        <button onClick={deleteFile}>
            delete
        </button>
    );
}

export default DeleteFile