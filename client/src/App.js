import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Register from "./Components/Pages/Register";
import Cotesting from "./Components/Pages/Cotesting";
import Notfound from "./Components/Pages/Notfound";
import Update from "./Components/Pages/Update";
import Nointernet from "./Components/Pages/Nointernet";
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import bg from "./img/bg.png";
import { MainLayout } from "./styles/Layouts";
import Orb from "./Components/Orb/Orb";
import Navigation from "./Components/Navigation/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard";
import Income from "./Components/Income/Income";
import Expenses from "./Components/Expenses/Expenses";
import { useGlobalContext } from "./context/globalContext";
import { Offline, Online } from "react-detect-offline";

function App() {
  const user = localStorage.getItem("token");

  const [active, setActive] = useState(1);

  const global = useGlobalContext();
  console.log(global);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Dashboard />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  return (
    <>
      <Online>
        <BrowserRouter>
          <Routes>
            <Route path="/offline" element={<Offline />} />
            {user && (
              <Route
                path="/register"
                exact
                element={<Navigate replace to="/" />}
              />
            )}
            {!user && <Route path="/register" exact element={<Register />} />}
            {user && (
              <Route
                path="/"
                exact
                element={
                  <AppStyled bg={bg} className="App">
                    {orbMemo}
                    <MainLayout>
                      <Navigation active={active} setActive={setActive} />
                      <main>{displayData()}</main>
                    </MainLayout>
                  </AppStyled>
                }
              />
            )}
            {user && <Route path="/update" exact element={<Update />} />}
            <Route
              path="/update"
              exact
              element={<Navigate replace to="/register" />}
            />
            {user && <Route path="/test" exact element={<Cotesting />} />}
            <Route
              path="/test"
              exact
              element={<Navigate replace to="/register" />}
            />
            <Route
              path="/"
              exact
              element={<Navigate replace to="/register" />}
            />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </BrowserRouter>
      </Online>

      <Offline>
        <Nointernet />
      </Offline>
    </>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
