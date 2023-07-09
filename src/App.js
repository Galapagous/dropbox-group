import React, { useEffect, useState } from 'react';
import FileUpload from './file-upload';
import SessionTimeout from './sessionTimeout';
import { Amplify, Auth } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";
import MyContext from './myContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeleteFile from './delete_button'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Config from './aws-exports'
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
        <h1>My App</h1>
        <SessionTimeout timeoutDuration={sessionTimeoutDuration} />
        <FileUpload token={token}/><br />
        {filesDetails.length? (
          <Row className="my-2">
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                        <th>#</th>
                        <th>Files</th>
                    </tr>
                  </thead>
                  <tbody>               
                    {/* Render content when filesDetails has items */}
                    {filesDetails.map((file, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td><a href= {file.url}>{file.file}</a></td>
                        <td><DeleteFile fileName={file.file} token={token} /></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>        
        ) : (
          <p>No files available</p>
        )}

        {user && (
          <button onClick={handleSignOut} className="float-right">
            Sign Out
          </button>
        )
        }

      </div>
  );

};

export default withAuthenticator(App);
