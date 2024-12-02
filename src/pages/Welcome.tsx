import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mairie de la Commune
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bienvenue sur le portail de gestion financière de notre commune.
            Une plateforme moderne pour une gestion transparente et efficace.
          </p>
        </div>

        {/* Présentation Principale */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Notre Mairie</h2>
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-600 mb-6">
                  La Mairie de la Commune est une institution dédiée au service des citoyens 
                  et au développement durable de notre communauté. Notre engagement envers 
                  l'excellence et la transparence guide chacune de nos actions.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nos Engagements</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Service aux citoyens 24h/24 et 7j/7</li>
                  <li>Gestion transparente des finances publiques</li>
                  <li>Développement des projets communautaires</li>
                  <li>Amélioration continue des services municipaux</li>
                  <li>Protection de l'environnement</li>
                  <li>Soutien aux initiatives locales</li>
                </ul>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Financier</h2>
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-600 mb-6">
                  Le service financier est le garant d'une gestion saine et transparente 
                  des ressources de la commune. Notre équipe s'engage à maintenir les plus 
                  hauts standards de gestion financière.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nos Services</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Suivi rigoureux des recettes et dépenses</li>
                  <li>Gestion optimisée du budget communal</li>
                  <li>Reporting financier régulier</li>
                  <li>Contrôle interne strict</li>
                  <li>Conseil et accompagnement des projets</li>
                  <li>Digitalisation des processus financiers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Objectifs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Nos Objectifs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-700 mb-3">Transparence</h3>
              <p className="text-green-600">
                Gestion claire et accessible des finances publiques, avec un reporting régulier 
                et des processus transparents.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Efficacité</h3>
              <p className="text-blue-600">
                Optimisation des ressources et des processus pour une gestion financière 
                performante et responsable.
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-purple-700 mb-3">Innovation</h3>
              <p className="text-purple-600">
                Modernisation continue des services financiers avec l'adoption des 
                meilleures pratiques et technologies.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            Accéder au Tableau de Bord
            <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
