import React from 'react';
import './styles/button.css';

const Button = ({ onClick, color, label, icon }) => {
  return (
    <button onClick = {onClick} className={`custom-button ${color}`}>
      {icon}
      {label}
    </button>
  );
};

export default Button;
