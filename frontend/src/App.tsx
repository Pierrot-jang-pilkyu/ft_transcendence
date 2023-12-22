import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import { useState, createContext, useEffect } from "react";
import AfterLogin from "./pages/AfterLogin";
export const LoginContext = createContext();
export const RenderContext = createContext();
export const dmContext = createContext();
import { Cookies } from "react-cookie";
import axios from "axios";
import Loading from "./pages/Loading/Loading";

const cookies = new Cookies();

export const setCookie = (name: string, value: string, options?: any) => {
  return cookies.set(name, value, { ...options });
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

// Socket connet
//HERE
function App() {
  const [render, setRender] = useState<boolean | undefined>();
  const [login, setLogin] = useState<boolean | undefined>();
  const [dm, setDm] = useState<boolean | undefined>();
  const [ifLoginPage, setIfLoginPage] = useState<React.ReactNode | null>(
    <Loading />
  );

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://" + import.meta.env.VITE_BACKEND + "/auth/check/login")
      .then(() => {
        setLogin(true);
      })
      .catch((error) => {
        if (error.response.data.message === "Unauthorized") {
          axios
            .get("http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/2fa")
            .then(() =>
              axios
                .post(
                  "http://" + import.meta.env.VITE_BACKEND + "/auth/check/login"
                )
                .then(() => {
                  setLogin(true);
                })
            )
            .catch(() => {
              setLogin(false);
            });
        }
      });
  }, []);

  useEffect(() => {
    if (login == undefined) setIfLoginPage(<Loading />);
    else if (login == false) setIfLoginPage(<Home />);
    else if (login == true) {
      setIfLoginPage(<AfterLogin />);
    }
  }, [login]);

  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&family=Noto+Sans:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&display=swap"
        rel="stylesheet"
      />
      <LoginContext.Provider value={[login, setLogin] as any}>
        <RenderContext.Provider value={[render, setRender] as any}>
          <dmContext.Provider value={[dm, setDm] as any}>
          <BrowserRouter>{ifLoginPage}</BrowserRouter>
          </dmContext.Provider>
        </RenderContext.Provider>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
