import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Accès non autorisé
        </h2>
        <p className="text-gray-600 mb-8">
          Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Retour
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
