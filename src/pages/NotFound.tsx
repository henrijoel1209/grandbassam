import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Page non trouvée</h2>
        <p className="text-gray-500 mt-2">Désolé, la page que vous recherchez n'existe pas.</p>
        <Link 
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
