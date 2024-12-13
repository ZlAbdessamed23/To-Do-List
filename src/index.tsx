/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import { Route, Router } from '@solidjs/router';
import WelcomePage from './App';
import ToDoList from './pages/ToDoList';
import { Toaster } from 'solid-toast';
import ToDoDisplay from './pages/ToDoDisplay';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => <>
  <Toaster />
  <Router>
    <Route path={"/"} component={WelcomePage} />
    <Route path={"/todos"} component={ToDoList} />
    <Route path={"/todos/display"} component={ToDoDisplay} />
  </Router>

</>, root!);
