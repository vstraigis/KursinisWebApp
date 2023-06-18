import React from "react";
import "../css/Dashboard.css";
import fish from "../../assets/img/fishhome.svg";

const Home = () => {
  return (
    <div className="homecontainer">
      <div className="hometext">
        <p className="hometitle">Sveiki atvykę į žvejo svetainę PELEKAS!</p>
        <p className="homeparag">
          Čia galite planuoti savo žvejybos keliones, patogiai išsisaugoti savo
          licenzijas, pasižiūrėti orus norimame ežere, ir sekti savo žvejybos
          statistiką.
        </p>
        <p className="homeparag">Gerinkite savo žvejybą su mumis!</p>
      </div>
      <div className="homeimg">
        <img className="fishlogo" src={fish} alt="fish" />
      </div>
    </div>
  );
};

export default Home;
