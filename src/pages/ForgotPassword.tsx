import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // TODO: Implement actual password reset request
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setMessage('Un email de réinitialisation a été envoyé à votre adresse email.');
    } catch (error) {
      setStatus('error');
      setMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Réinitialisation du mot de passe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div
              className={`p-4 rounded-md ${
                status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              Adresse Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Retour à la connexion
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
