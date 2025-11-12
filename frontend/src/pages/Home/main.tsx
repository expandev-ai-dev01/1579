import { useState } from 'react';
import { Button } from '@/core/components/Button';
import { Modal } from '@/core/components/Modal';
import { TaskForm } from '@/domain/task/components';
import type { HomePageProps } from './types';

export const HomePage = (props: HomePageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">TODO List</h1>
            <p className="text-xl text-gray-600">Gerencie suas tarefas</p>
          </div>
          <Button onClick={handleOpenModal}>Criar Tarefa</Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Suas Tarefas</h2>
          <p className="text-gray-600 text-center py-8">
            Nenhuma tarefa encontrada. Clique em "Criar Tarefa" para começar.
          </p>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Criar Nova Tarefa">
        <TaskForm onSuccess={handleCloseModal} onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default HomePage;
