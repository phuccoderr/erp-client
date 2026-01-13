import { useRouteError } from "react-router-dom";
const ErrorLayout = () => {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Rất tiếc!</h1>
      <p>Đã có lỗi xảy ra ngoài ý muốn.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button onClick={() => (window.location.href = "/")}>
        Quay lại trang chủ
      </button>
    </div>
  );
};

export default ErrorLayout;
