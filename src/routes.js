import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Entrada from './pages/Entrada';
import Home from './pages/Home';

import Logar from './pages/Organizador/Logar';
import Registrar from './pages/Organizador/Cadastrar';
import Perfil from './pages/Organizador/Perfil';
import AlterarPerfil from './pages/Organizador/Alterar';

import CriarEvento from './pages/Eventos/Criar';
import DetalheEvento from './pages/Eventos/Detalhe';
import AlterarEvento from './pages/Eventos/Alterar';



export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={ Entrada } />
                <Route path="/user/login" component={ Logar } />
                <Route path="/user/cadastrar" component={ Registrar } />
                <Route path="/home" component={ Home } />
                <Route path="/eventos/detalhes/:id" component={ DetalheEvento } />
                <Route path="/eventos/cadastrar" component={ CriarEvento } />
                <Route path="/eventos/editar/:id" component={ AlterarEvento } />
                <Route path="/user/perfil" component={ Perfil } />
                <Route path="/user/editar" component={ AlterarPerfil } />
            </Switch>
        </BrowserRouter>
    );
}