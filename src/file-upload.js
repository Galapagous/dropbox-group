import React from 'react';
import axios from 'axios';

const FileUpload = ({token, reload}) => {

  let payload = {}
  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
        
    reader.onloadend = function() {
      const base64String = reader.result.split(",")[1];
      payload = {
        fileData: base64String,
        fileName: file.name,
        fileType: file.type, 
        token: token
      };
      console.log(payload);
    }

    reader.readAsDataURL(file);
  }


  async function handleUpload() {
    
    //console.log(accessToken)
    axios.post('https://c5548t22l9.execute-api.eu-north-1.amazonaws.com/dev',
      payload
    )
    .then((response) => {
        if (response.ok){
          console.log("file uploaded")
          window.location.reload();
        
        }
        else{
          console.log("uploading failed")
          window.location.reload(); 
        }
      }
    )
    .catch((error) =>{
          console.error(error);
      }
    )
  }


  return (
    <div>
      <h2>File Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;