import React, { useEffect, useState } from 'react';
import FileUpload from './components/FileUoload/file-upload';
import SessionTimeout from './components/Session/sessionTimeout';
import { Amplify, Auth } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import DeleteFile from './components/Buttons/delete_button'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Config from './aws-exports'
import './App.css'
import { Description } from '@mui/icons-material';
Amplify.configure(Config)



const App = () => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null)
  const sessionTimeoutDuration = 1200000
  const [filesDetails, setFilesDetails] = useState([])  //const [userAuth, setUserAuth] = useState("")


  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => setUser(user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const gatewayUrl = 'https://bgt8168cpa.execute-api.eu-north-1.amazonaws.com/dev/files'
        const session = await Auth.currentSession();
        const accessToken = session.accessToken.jwtToken;
        setToken(accessToken)
        const value = {
          'access_Token': accessToken
        }

        //console.log(value)
        const response = await fetch(gatewayUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(value)
        });

        if (response.ok) {
          const userDetails = await response.json();

          setFilesDetails(userDetails.body)
          // Do something with user details, such as update state or display user information
          console.log(userDetails.body);
          console.log(filesDetails)

        } else {
          throw new Error('Unable to retrieve user details');
        }
      } catch (err) {
        // Handle error
        console.error(err);
      }
    }
    loadPage()
  }, []);

  //handles signout
  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };




  return (
   
      <div className='App'>
        <h1>DropBox App</h1>
        <SessionTimeout timeoutDuration={sessionTimeoutDuration} />
        <FileUpload token={token}/><br />
        {filesDetails.length? (
          <div className="main_container">
              <div className='col_container'>
                    {/* Render content when filesDetails has items */}
                    {filesDetails.map((file, index) => (
                      <div className='file_item' key={index}>
                        <p>{index + 1}</p>
                        <Description/>
                        <p className='text_description'><a href= {file.url}>
                          {file.file}</a></p>
                        <p><DeleteFile fileName={file.file} token={token} /></p>
                      </div>
                    ))}
                  </div>
            </div>        
        ) : (
          <p>No files available</p>
        )}

        {user && (
          <button className='signOut' onClick={handleSignOut} className="float-right">
            Sign Out
          </button>
        )
        }

      </div>
  );

};

export default withAuthenticator(App);
