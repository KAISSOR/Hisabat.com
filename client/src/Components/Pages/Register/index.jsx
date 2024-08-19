import  { useState , React , useContext } from "react";
import * as Components from '../../middleware/Components/Components';
import axios from 'axios'; 
import { AuthContext } from '../../middleware/AuthContext'; 
import Cookies from "universal-cookie";

function Register() {

    const cookies = new Cookies()
    // const [mytoken, setMytoken] = useState();
    const [companyName, setCompanyName] = useState('');
    const [companyCode, setCompanyCode] = useState('');
    const [companyPassword, setCompanyPassword] = useState('');
    const [companyImage, setCompanyImage] = useState(null);
    const [signIn, toggle] = useState(true);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [errorr, setErrorr] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [successMessagee, setSuccessMessagee] = useState(null);  
    const handleSubmit = async (event) => {
    const formData = new FormData();

    event.preventDefault();

    formData.append('CoName', companyName);
    formData.append('CoCode', companyCode);
    formData.append('CoPassword', companyPassword);

    if (companyImage) {
        formData.append('profileImage', companyImage);
    };

    try {
        const response = await axios.post('http://localhost:5000/companies/signup', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for imageى uploads
          },
        });
        setSuccessMessage(response.data.message);
        setCompanyName('');
        setCompanyCode('');
        setCompanyPassword('');
        setCompanyImage(null);
        setError(null);
    } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || 'Server error'); // Handle specific or generic errors
    }};

    const handleImageChange = (event) => {
      setCompanyImage(event.target.files[0]);
    };

//////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [companyCodee, setCompanyCodee] = useState('');
    const [companyPasswordd, setCompanyPasswordd] = useState('');
    const { setIsLoggedIn, setUser } = useContext(AuthContext); // Assuming AuthContext
    
    const handleSubmitt = async (event) => {
      event.preventDefault();
    
      try {
        const response = await axios.post('http://localhost:5000/companies/login', {
          CoName: companyCodee,
          CoCode: companyCodee,
          CoPassword: companyPasswordd,
        });
        const token = response.data.token;
        const Image = response.data.company.CoImage;
        const Name = response.data.company.CoName;
        if (token) {
          console.log(Image)
          setSuccessMessagee(response.data.message);
          // setMytoken(token);
          setIsLoggedIn(true); 
          setUser(response.data.user || {}); 
          cookies.set("auth-company", token);
          localStorage.setItem("token", token);
          localStorage.setItem("image", Image);
          localStorage.setItem("name", Name);
          window.location = "/"; 

        } else {
          console.error("No token received in login response");
          setErrorr("Login failed: No token received"); 
        }
    
        setErrorr(null); 
    
      } catch (error) {
        console.error(error);
        setErrorr(error.response?.data?.message || 'Login failed');
      }
    };

///////////////////////////////////////////////////////////////////////////////////////////////////////////
   
return(
  <div style={{
    boxSizing: 'border-box',
    background: '#f6f5f7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    fontFamily: '"Montserrat", sans-serif',
    height: '100vh',
    margin: '-20px 0 50px',
  }}>
         <Components.Container>



             <Components.SignUpContainer  signinIn={signIn}>
                 <Components.Form onSubmit={handleSubmit}>
                    <Components.Title>Create Account</Components.Title>
                    <Components.Input type='text' placeholder='Company Name' value={companyName} onChange={(e) => setCompanyName(e.target.value)} required  />
                    <Components.Input type='text' placeholder='Company code' value={companyCode} onChange={(e) => setCompanyCode(e.target.value)} required  />
                    <div  style={{ display: 'flex', alignItems: 'center' ,  alignItems: 'rihgt'}}>
                    <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                    <h6>Show Password</h6></div> 
                    <Components.Input type={showPassword ? 'text' : 'password'}  placeholder='Password' value={companyPassword} onChange={(e) => setCompanyPassword(e.target.value)} required />              
                    <Components.Input type='file' onChange={handleImageChange}  />
                    {error && error.length > 0 && <div>{error}</div>}
                    {successMessage && <div className="success">{successMessage}</div>}
                    <Components.Button  type='submit' >Sign Up</Components.Button>
                 </Components.Form>
             </Components.SignUpContainer>


             <Components.SignInContainer  signinIn={signIn}>
                  <Components.Form onSubmit={handleSubmitt}>
                      <Components.Title>Sign in</Components.Title>
                      <br></br>
                      <Components.Input type='text' placeholder="Company Code" value={companyCodee} onChange={(e) => setCompanyCodee(e.target.value)} required/>
                      <div  style={{ display: 'flex', alignItems: 'center' ,  alignItems: 'rihgt'}}>
                      <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                      <h6>Show Password</h6></div> 
                      <Components.Input type={showPassword ? 'text' : 'password'}  placeholder='Password' value={companyPasswordd} onChange={(e) => setCompanyPasswordd(e.target.value)} required />              
                      {successMessagee && (<div className="success" >{successMessagee}</div>)}
                      {errorr && (<div className="error">{errorr}</div>)}
                      <br></br>
                      <Components.Button type='submit' >Sigin In</Components.Button>
                  </Components.Form>
             </Components.SignInContainer>


             <Components.OverlayContainer  signinIn={signIn}>
                 <Components.Overlay  signinIn={signIn}>

                 <Components.LeftOverlayPanel  signinIn={signIn}>
                     <Components.Title>Welcome Back!</Components.Title>
                     <Components.Paragraph>
                         To keep connected with us please login with your personal info
                     </Components.Paragraph>
                     <Components.GhostButton onClick={() => toggle(true)}>
                         Sign In
                     </Components.GhostButton>
                     </Components.LeftOverlayPanel>

                     <Components.RightOverlayPanel  signinIn={signIn}>
                       <Components.Title>Hello, Friend!</Components.Title>
                       <Components.Paragraph>
                           Enter Your personal details and start journey with us
                       </Components.Paragraph>
                           <Components.GhostButton onClick={() => toggle(false)}>
                               Sigin Up
                           </Components.GhostButton> 
                     </Components.RightOverlayPanel>
 
                 </Components.Overlay>
             </Components.OverlayContainer>



         </Components.Container>
         </div>
     )
};

export default Register;