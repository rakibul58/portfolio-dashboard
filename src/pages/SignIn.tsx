/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser, TUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import { verifyToken } from "@/utils/verifyToken";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

type TLoginUser = {
  user: string;
  password: string;
};

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isHidden, setIsHidden] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginUser>();

  const [login] = useLoginMutation();

  const handleLogin: SubmitHandler<TLoginUser> = async (data: TLoginUser) => {
    const toastId = toast.loading("Logging in", { duration: 3000 });
    try {
      const res = await login(data).unwrap();
      const user = verifyToken(res.data.token) as TUser;
      dispatch(setUser({ user: user, token: res.data.token }));
      toast.success(res.message, { id: toastId, duration: 2000 });

      navigate(`/dashboard`);
    } catch (err: any) {
      toast.error(err.data.message || "Something went wrong", {
        id: toastId,
        duration: 2000,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="backdrop-blur-sm bg-background/95 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome Back
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Sign in to access your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="text-sm font-medium block mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    id="text"
                    placeholder="xyz@gmail.com"
                    {...register("user", {
                      required: "Username is required",
                    })}
                    className="w-full px-4 py-3 rounded-lg border bg-secondary/50 focus:ring-2 focus:ring-primary transition-all duration-200"
                  />
                  {errors.user && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-destructive text-sm mt-1 block"
                    >
                      {errors.user.message}
                    </motion.span>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="password"
                  className="text-sm font-medium block mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={isHidden ? "password" : "text"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full px-4 py-3 rounded-lg border bg-secondary/50 focus:ring-2 focus:ring-primary transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setIsHidden(!isHidden)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {isHidden ? (
                      <Eye className="size-5" />
                    ) : (
                      <EyeOff className="size-5" />
                    )}
                  </button>
                  {errors.password && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-destructive text-sm mt-1 block"
                    >
                      {errors.password.message}
                    </motion.span>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <Button size="lg" className="w-full">
                  Sign In
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default SignIn;
