import './App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import auth from './firebase.init';
import { createUserWithEmailAndPassword, GithubAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";

const GoogleProvider = new GoogleAuthProvider();
const GitHubProvider = new GithubAuthProvider();
function App() {

  const [name, setName] = useState('')
  const [user, setUser] = useState({})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState(false)

  const handleNameBlur = event => {
    setName(event.target.value);
  }
  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }

  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }

  const handleRegisteredChange = event => {
    setRegistered(event.target.checked);
  }

  const handleFormSubmit = event => {
    console.log(email, password);
    event.preventDefault()

    // validate password with RegEx
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
      setError('Please insert a number, a character and a special character')
      return;
    }
    setError('')

    // Validation for Form input fields
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    setValidated(true);

    // Toggle Registration and Login
    if (registered) {
      // Login User
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          // Signed in 
          const user = result.user;
          console.log(user);

        })
        .catch((error) => {
          const errorMessage = error.message;
          console.error(errorMessage)
          setError(errorMessage)
        });
    }
    else {
      // Register user
      createUserWithEmailAndPassword(auth, email, password, name)
        .then((result) => {
          // Sign UP
          const user = result.user;
          console.log(user);
          setSuccess(user)
          setEmail('')
          setPassword('')
          emailVerify()
          setUserName()
          // ...
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.error(errorMessage);
          setError(errorMessage)
          // ..
        });
    }

    // Email Verification by Sending email to user
    const emailVerify = () => {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          console.log('Monu! Your Verification is Successful');
        });
    }

    // Get User Name at the time of registration
    const setUserName = () => {
      updateProfile(auth.currentUser, {
        displayName: name
      }).then(() => {
        console.log('Your faltu name is taken');
      }).catch((error) => {
        setError(error.message)
      });
    }

  }
  //  Reset Password
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Email is sent to reset password');
      })
      .catch((error) => {

        const errorMessage = error.message;
        console.log(errorMessage);
        setError(errorMessage)
      });

  }

  // Google Sign In
  const handleGoogleSignIn =  () =>{
    signInWithPopup(auth, GoogleProvider)
  .then((result) => {
    const user = result.user;
    setUser(user);
    console.log(user);
  }).catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
    setError(errorMessage)
  });
  }
//  Git Hub Sign In
  const handlegitHubsignin = () =>{
    signInWithPopup(auth, GitHubProvider)
  .then((result) => {
    const user = result.user;
    setUser(user);
  }).catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
  });
  }
// Handle LogOut
  const handleLogOut = () =>{
    signOut(auth).then(() => {
      setUser({})
      console.log('SignOut SuccessFull');
    }).catch((error) => {
    
    });
  }


  return (
    <div>
      <div className='register w-50 mx-auto mt-5'>
        <h2 className='text-primary'>Please {registered ? 'Login' : 'Register'}!!</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Full Name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" name='name' placeholder="Your Name" required />
            {/* {error} */}
            <Form.Control.Feedback type="invalid">
              Please provide a valid Name.
            </Form.Control.Feedback>
          </Form.Group>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" name='email' placeholder="Enter email" required />
            {/* {error} */}
            <Form.Control.Feedback type="invalid">
              Please provide a valid Email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" name='password' placeholder="Password" required />

            <Form.Control.Feedback type="invalid">
              Please provide a valid Password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Alredy Registered ?" />
          </Form.Group>
          <p className='text-success'>{success && "Registration Successful"}</p>
          <p className='text-danger'>{error}</p>
          <Button variant="link" onClick={handlePasswordReset}>Forget Password ?</Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? 'LOGIN' : 'REGISTER'}
          </Button>
        </Form>
        {
          user.uid ?
          <Button className='m-3' variant="warning" onClick={handleLogOut}>Log OUt</Button>:
          <>
            <Button className='m-3' variant="success" onClick={handleGoogleSignIn}>Google Signin</Button>
            <Button className='m-3' variant="info" onClick={handlegitHubsignin}>GitHub Signin</Button>
          </>
        }

         <h3>Name: {user.displayName}</h3>
         <p>{user.email}</p>
         <img src={user.photoURL} alt="" />
      </div>
    </div>
  );
}

export default App;
