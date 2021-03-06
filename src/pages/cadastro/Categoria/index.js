import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PageDefault from '../../../components/PageDefault';
import FormField from '../../../components/FormField';
import Button from '../../../components/Button';
import useForm from '../../../hooks/useForm';
import './index.css';
import CategoriasRepository from '../../../repositories/categorias';

function CadastroCategoria() {
  const valoresIniciais = {
    titulo: '',
    descricao: '',
    cor: '',
  };

  const { handleChange, values, clearForm } = useForm(valoresIniciais);

  const [categorias, setCategorias] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const URL_CAT = window.location.hostname.includes('localhost')
      ? 'http://localhost:8080/categorias'
      : 'https://doolpflix.herokuapp.com/categorias';
    fetch(URL_CAT)
      .then(async (respostaDoServidor) => {
        const resposta = await respostaDoServidor.json();
        setCategorias([
          ...resposta,
        ]);
      });
  }, []);

  return (
    <PageDefault>
      <h1>
        Cadastro de Categoria:
        {values.titulo}
      </h1>

      <form
        id="form"
        onSubmit={function handleSubmit(infosDoEvento) {
          infosDoEvento.preventDefault();
          CategoriasRepository.create({
            titulo: values.titulo,
            descricao: values.descricao,
            cor: values.cor,
          })
            .then(() => {
              history.push('/cadastro/Video');
            });
        }}
        onReset={(event) => {
          event.preventDefault();
          clearForm();
        }}
      >

        <FormField
          label="Nome da Categoria"
          name="titulo"
          value={values.titulo}
          onChange={handleChange}
        />

        <FormField
          label="Descrição"
          type="textarea"
          name="descricao"
          value={values.descricao}
          onChange={handleChange}
        />

        <FormField
          label="Cor"
          type="color"
          name="cor"
          value={values.cor}
          onChange={handleChange}
        />

        <Button.B
          btnType="Submit"
          form="form"
          type="Submit"
        >
          Cadastrar
        </Button.B>

        <Button.C
          btnType="Reset"
          form="form"
          type="Reset"
        >
          Limpar
        </Button.C>
      </form>

      {categorias.length === 0 && (
        <div>
          Loading...
        </div>
      )}
      <div>
        <table>
          <thead>
            <tr>
              <td>Título</td>
              <td>Descrição</td>
              <td>Editar</td>
              <td>Remover</td>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.titulo}</td>
                <td>{categoria.descricao}</td>
                <td>
                  <Button.D onClick={(event) => {
                    event.preventDefault();
                    history.push({
                      pathname: '/cadastro/editarcategoria',
                      data: [categoria.id, categoria.titulo, categoria.descricao, categoria.cor],
                    });
                  }}
                  >
                    editar
                  </Button.D>
                </td>
                <td>
                  <Button.D onClick={(event) => {
                    event.preventDefault();
                    CategoriasRepository.remove(categoria, categoria.id);
                    history.push('/cadastro/video');
                  }}
                  >
                    remover
                  </Button.D>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button.A as={Link} to="/">
        Ir para home
      </Button.A>
    </PageDefault>
  );
}

export default CadastroCategoria;
