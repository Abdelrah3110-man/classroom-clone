import React from 'react';
import { Link } from 'react-router-dom';

const ApplicationLogo = ({ className = '', ...props }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      <span className="text-primary uppercase font-bold tracking-widest text-2xl">
        fci
      </span>
      <span className="text-text-main font-semibold text-xl">
        Classroom
      </span>
    </div>
  );
};

export default ApplicationLogo;
