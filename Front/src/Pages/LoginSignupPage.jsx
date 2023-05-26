import React, { useState, useEffect } from "react";
import "./css/LoginSignupPage.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";





const FormPage = ({ isAuth, authChange}) => {
  const [signin, setSignin] = useState(true);


  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate('/');
    }
  }, [isAuth, navigate]);

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: logmail,
          password: logpass
        }),
      });

      if (response.status === 401 || response.status === 403) {
        toast.error("User does not exist or Password is incorrect");
        return 0;
      }

      const parseRes = await response.json();

      localStorage.setItem("token", parseRes.token);

      authChange();

      toast.success("Logged In");
      navigate('/dashboard');

    } catch (error) {
      console.log(error, "handleSignIn error");
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regname,
          email: regmail,
          password: regpass
        }),
      });

      if (response.status === 401) {
        toast.error("Invalid input or email already exists");
        return 0;
      }

      const parseRes = await response.json();

      localStorage.setItem("token", parseRes.token);

      toast.success("Registered");

      authChange();

      navigate('/dashboard');

    } catch (error) {
      toast.error("Invalid input or email already exists");
    }
  };


  const [regname, setName] = useState("");
  const [regmail, setEmail] = useState("");
  const [regpass, setPassword] = useState("");
  const [logmail, setLogEmail] = useState("");
  const [logpass, setLogPassword] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogEmailChange = (event) => {
    setLogEmail(event.target.value);
  };

  const handleLogPasswordChange = (event) => {
    setLogPassword(event.target.value);
  };


  return (
    <div className="zama-form">
      <div className={`containermain ${!signin ? 'right-panel-active' : ''}`} id="containermain">
        <div className="form-container sign-up-container">
          <form className="logregform" action='#' onSubmit={handleSignUp} >
            <h1 className="reg-text">Registracija</h1>
            <div className="social-container">
            </div>
           
            <input className="regname" type="text" placeholder="Vardas" value={regname} onChange={handleNameChange} />
            <input className="regmail" type="email" placeholder="El.Paštas" value={regmail} onChange={handleEmailChange} />
            <input className="regpass" type="password" placeholder="Slaptažodis" value={regpass} onChange={handlePasswordChange} />
            <button className="logregbutt" type="submit">Užsiregistruoti</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form className="logregform" action="#" onSubmit={handleSignIn} >
            <h1 className="log-text">Prisijungimas</h1>
            <div className="social-containerform">
            </div>
           
            <input className="logmail" type="email" placeholder="El.Paštas" value={logmail} onChange={handleLogEmailChange} />
            <input className="logpass" type="password" placeholder="Slaptažodis" value={logpass} onChange={handleLogPasswordChange} />
            <button className="logregbutt">Prisijungti</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlayform">
            <div className="overlay-panel overlay-left">
              <h1>Sveikas, Žvejy!</h1>
              <p className="greeting">Pradėkite savo geriausią žvejybos kelionę su mumis!</p>
              <button className="ghost" onClick={e => setSignin(true)}>Prsijungti</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Sveikas, Žvejy!</h1>
              <p className="greeting">Prisijunkite, kad neprarastumėte naujienų!</p>
              <button className="ghost" onClick={e => setSignin(false)}>Registruotis</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;