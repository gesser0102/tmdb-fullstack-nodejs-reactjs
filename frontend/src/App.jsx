import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";
import  { theme }  from './configs/themeConfig';
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageWrapper from "./components/common/PageWrapper";
import  routes  from "./routes/routes";
import { MainLayout } from "./components/layout/MainLayout";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";



const App = () => {
  return (
      <ThemeProvider theme={theme}>
        
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover sx={{mt: 2}}/>

        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {routes.map((route, index) => (
                route.index ? (
                  <Route
                    index
                    key={index}
                    element={route.state ? (
                      <PageWrapper state={route.state}>{route.element}</PageWrapper>
                    ) : route.element}
                  />
                ) : (
                  <Route
                    path={route.path}
                    key={index}
                    element={route.state ? (
                      <PageWrapper state={route.state}>{route.element}</PageWrapper>
                    ) : route.element}
                  />
                )
              ))}
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
  );
};

export default App;
