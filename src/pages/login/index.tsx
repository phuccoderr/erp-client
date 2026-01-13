import { Container } from "@components/layouts";
import CarouselLoginComponent from "@pages/login/components/carousel-login.component";
import FormLogin from "./components/form-login.component";
import { useThemeStore } from "@stores";
import { useEffect } from "react";

const LoginPage = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    setTheme("light");
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, []);
  return (
    <Container className="flex justify-between gap-2 px-4">
      <div className="hidden sm:flex sm:flex-1">
        <CarouselLoginComponent />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <FormLogin />
      </div>
    </Container>
  );
};

export default LoginPage;
