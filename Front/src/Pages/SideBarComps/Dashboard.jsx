import React from 'react';
import '../css/Dashboard.css'
import fish from '../../assets/img/fishhome.svg'


const Dashboard = () => {
  return (
    <div className='homecontainer'>
      <div className='hometext'>
        <p className='hometitle'>Welcome to Fishy Business!</p>
        <p className='homeparag'>Here you can plan your fishing trips,
         keep track of your catches, and share your experiences with other anglers.</p>
        <p className='homeparag'>Click on the menu icon to get started!</p>

      </div>
      <div className='homeimg'><img className='fishlogo' src={fish} alt='fish' /></div>
    </div>
  );
  };

export default Dashboard;