import type { HomePageProps } from './types';

export const HomePage = (props: HomePageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">TODO List App</h1>
        <p className="text-xl text-gray-600 mb-8">Sistema de gerenciamento de tarefas</p>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome!</h2>
          <p className="text-gray-600">Your task management system is ready to use.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
