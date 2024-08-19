import React, { useState } from 'react';
import axios from 'axios'; // Assuming you're using Axios for HTTP requests
import styles from './styles.module.css'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const Update = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const tokenoo = localStorage.getItem("token");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('CoName', companyName);
    formData.append('CoPassword', companyPassword);

    if (selectedImage) {
      formData.append('profileImage', selectedImage);
    }

    try {
      const response = await axios.put(`http://localhost:5000/companies/update`, formData, {
        headers: {
            'auth-company':tokenoo 
                 },
      });
      const Image = response.data.company.CoImage;
      const Name  = response.data.company.CoName;

      localStorage.removeItem('name'); 
      localStorage.removeItem('image');
      localStorage.setItem("image", Image);
      localStorage.setItem("name", Name);
      window.location = "/"; 

      setSuccessMessage(response.data.message);
      setErrorMessage(''); 
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Personal data updated successfully'
    });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Server error');
      } else {
        setErrorMessage('Network error');
      }
    } finally {
      setCompanyName('');
      setCompanyPassword('');
      setSelectedImage(null);
    }
  };



  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  return (
    <div className={styles.signup_container}>
    <div className={styles.signup_form_container}>

    <div className={styles.left}>

        <h1>Welcome Back</h1>
        
        <p>
          After choosing a password, please write it down carefully 
          and share it with your team via email in complete confidentiality.
          To avoid forgetting your password,
        </p>
        <p>
          if you forget your password, please contact the site
          administrator to help you recover your account 
          if you forget your password.
        </p>
        <br></br>
        <br></br>
        <br></br>

        <Link to="/" className={styles.blue_btn} >Back to Home Page</Link>

    </div>
    <div className={styles.slach} >__</div>

    <div className={styles.right}>
    <form className={styles.form_container} onSubmit={handleSubmit}>

      <div>
        <h1>Update Information</h1>
      </div>
      <br/>

      <div>
        <input
          type="text"
          id="companyName"
          name="companyName"
          placeholder='New Company Name'
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <div>
        <label htmlFor="showPassword">Show Password  </label>
        <input
          type="checkbox"
          id="showPassword"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}

        />
      </div>

      <div>
        <input
          type={showPassword ? 'text' : 'password'}
          id="companyPassword"
          name="companyPassword"
          placeholder='New Company Password'
          value={companyPassword}
          onChange={(e) => setCompanyPassword(e.target.value)}
          required
          className={styles.input}
        />
      </div> 
      <br/>

      <div>
        <input type="file" id="profileImage" name="profileImage" onChange={handleImageChange} className={styles.input}/>
      </div>
      <br/>

      <button type="submit"  className={styles.green_btn} >Update </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </form>
    </div>

    </div>
    </div>

  );
};

export default Update;



























// import  { useState , React , useContext } from "react";
// import * as Components from '../../middleware/Components/Components';
// import axios from 'axios'; // Assuming you're using axios for API requests
// import { AuthContext } from '../../middleware/AuthContext'; // Replace with your AuthContext if applicable
// // import Mytoken from './../../middleware/Mytoken'; // Assuming you're using axios for API requests
// import Cookies from "universal-cookie";

// function Update() {

//     const cookies = new Cookies()
//     const [mytoken, setMytoken] = useState();
//     const [companyName, setCompanyName] = useState('');
//     const [companyCode, setCompanyCode] = useState('');
//     const [companyPassword, setCompanyPassword] = useState('');
//     const [companyImage, setCompanyImage] = useState(null);
//     const [signIn, toggle] = useState(true);
//     const [error, setError] = useState(null);
//     const [showPassword, setShowPassword] = useState(false); // State for password visibility
//     const [errorr, setErrorr] = useState(null);
//     const [successMessage, setSuccessMessage] = useState(null);
//     const [successMessagee, setSuccessMessagee] = useState(null);  
//     const handleSubmit = async (event) => {
//       event.preventDefault();
  
//       const formData = new FormData();
//       formData.append('CoName', companyName);
//       formData.append('CoCode', companyCode);
//       formData.append('CoPassword', companyPassword);
  
//     if (companyImage) {
//         formData.append('profileImage', companyImage);
//     };
//     try {
//         const response = await axios.post('http://localhost:5000/companies/signup', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data', // Important for imageى uploads
//           },
//         });
//         setSuccessMessage(response.data.message);
//         setCompanyName('');
//         setCompanyCode('');
//         setCompanyPassword('');
//         setCompanyImage(null);
//         setError(null);
//     } catch (error) {
//         console.error(error);
//         setError(error.response?.data?.message || 'Server error'); // Handle specific or generic errors
//     }};
//     const handleImageChange = (event) => {
//       setCompanyImage(event.target.files[0]);
//     };
   
// return(
// <Components.Container>

//             <Components.SignUpContainer  signinIn={signIn}>
//                 <Components.Form onSubmit={handleSubmit}>
//                     <Components.Title>Create Account</Components.Title>
//                     <Components.Input type='text' placeholder='Company Name' value={companyName} onChange={(e) => setCompanyName(e.target.value)} required  />
//                     <Components.Input type='text' placeholder='Company code' value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} required  />
//                     <div  style={{ display: 'flex', alignItems: 'center' ,  alignItems: 'rihgt'}}>
//                     <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
//                     <h6>Show Password</h6></div> 
//                     <Components.Input type={showPassword ? 'text' : 'password'}  placeholder='Password' value={companyPassword} onChange={(e) => setCompanyPassword(e.target.value)} required />              
//                     <Components.Input type='file' onChange={handleImageChange}  />
//                     {error && error.length > 0 && <div>{error}</div>}
//                     {successMessage && <div className="success">{successMessage}</div>}
//                     <Components.Button  type='submit' >Sign Up</Components.Button>
//                 </Components.Form>
//             </Components.SignUpContainer>


//             <Components.OverlayContainer  >
//                 <Components.Overlay  >
//                     <Components.RightOverlayPanel  >
//                     <Components.Title>Welcome Back!</Components.Title>
//                     <Components.Paragraph>
//                         To keep connected with us please login with your personal info
//                     </Components.Paragraph>
//                     </Components.RightOverlayPanel>
//                 </Components.Overlay>
//             </Components.OverlayContainer>

// </Components.Container>
// )
// };
// /////////////////////////////////////////////////////////

// export default Update;