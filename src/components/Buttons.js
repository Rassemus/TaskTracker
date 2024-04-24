import React from 'react';
import './styles/button.css';

const Button = ({ color, label, icon }) => {
  return (
    <button className={`custom-button ${color}`}>
      {icon}
      {label}
    </button>
  );
};

export default Button;
