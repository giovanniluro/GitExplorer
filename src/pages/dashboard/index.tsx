import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Title, Form, Repositories, Error } from './styles';
import logoImg from '../../assets/logo2.svg';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepos = localStorage.getItem(
      '@githubrepositories:repositories'
    );

    if (storagedRepos) {
      return JSON.parse(storagedRepos);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@githubrepositories:repositories',
      JSON.stringify(repositories)
    );
  }, [repositories]);

  async function handleAddRepository(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (!newRepo) {
      setInputError('Insira o nome de algum repositório');
      return;
    }
    try {
      const response = await api.get<Repository>(`/repos/${newRepo}`);
      setRepositories([...repositories, response.data]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca desse repositório!');
    }
  }

  return (
    <>
      <img src={logoImg} alt="GitHub" />
      <Title>Explore repositórios no GitHub</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          type="text"
          placeholder="Digite o nome do repositório"
          value={newRepo}
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`/repository/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} color="#cbcbd6" />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
