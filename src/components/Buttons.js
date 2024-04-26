import React from 'react';
import './styles/button.css';

const Button = ({ disabled, onClick, color, label, icon }) => {
  return (
    <button disabled={disabled} onClick = {onClick} className={`custom-button ${color}`}>
      {icon}
      {label}
    </button>
  );
};

export default Button;
