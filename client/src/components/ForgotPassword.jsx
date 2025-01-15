import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/service/authService";
import { toast } from "@/hooks/use-toast";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let res = await forgotPassword({
      email : email
    })
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if(res && res.data.EC ===  0) {
       toast({
         variant: "success",
         title: res.data.EM ,
       })  
    }
    else {
      toast({
        variant: "destructive",
        title: res.data.EM ,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow-xl ring-1 ring-gray-900/10 sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Quên mật khẩu?
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Đừng lo lắng! Chỉ cần nhập email của bạn và chúng tôi sẽ gửi hướng
              dẫn đặt lại mật khẩu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Địa chỉ email
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Gửi hướng dẫn
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/login")}
                className="flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
