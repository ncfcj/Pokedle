import './App.css'
import { GamePage } from './components/GamePage/gamePage';
import {BrowserRouter, createBrowserRouter, RouterProvider} from "react-router-dom";
import {HomePage} from "./components/HomePage/homePage";
import {ErrorPage} from "./components/ErrorPage/errorPage";

function App(){
    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage/>,
            errorElement: <ErrorPage />,
        },
        {
            path: "/modes/classic",
            element: <GamePage/>,
            errorElement: <ErrorPage />
        },
        {
            path: "/modes/lives",
            element: <GamePage/>,
            errorElement: <ErrorPage />
        }
    ]);

  return (
    <div className="app">
        <RouterProvider router={router} />
    </div>
  )
}

export default App;
