import { ButtonAnimated } from "@components/animations";

const Loading = () => {
  // const handleClick = async () => {
  //   setStatus("processing");

  //   // Giả lập async operation
  //   await new Promise((resolve) => setTimeout(resolve, 2000));

  //   // Giả lập thành công hoặc lỗi
  //   if (Math.random() > 0.3) {
  //     setStatus("ok");
  //   } else {
  //     setStatus("error");
  //   }

  //   // Quay về idle sau 2 giây
  //   setTimeout(() => setStatus("default"), 2000);
  // };
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <span className="loader"></span>
      <ButtonAnimated>Hello các bạn</ButtonAnimated>
    </div>
  );
};

export default Loading;
