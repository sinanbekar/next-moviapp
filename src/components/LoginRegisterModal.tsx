import Modal from "@/components/Modal";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { BiLogIn, BiUserPlus } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import React from "react";
import { googleLogin } from "@/features/auth/authActions";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const LoginRegisterModal: React.FC<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showModal, setShowModal }) => {
  const [scene, setScene] = React.useState(1);
  const dispatch = useDispatch();

  const ContinueWithGoogle = () => (
    <div
      onClick={handleGoogleClick}
      className="flex justify-center mx-auto w-64 py-3 mt-6 cursor-pointer bg-gray-600 rounded-md"
    >
      <div className="flex items-center gap-2">
        <FcGoogle className="text-2xl" />
        <span className="font-semibold">Continue with Google</span>
      </div>
    </div>
  );

  const handleGoogleClick = () => {
    dispatch(googleLogin());
  };

  const LoginContent = () => (
    <>
      <h2 className="text-center text-2xl">Login</h2>
      <ContinueWithGoogle />
      <div className="m-4">
        <form className="my-4 opacity-20">
          <fieldset disabled={true}>
            <div className="mb-4">
              <input
                className="rounded w-full py-2 px-3 bg-gray-700"
                type="text"
                placeholder="Email Address"
              />
            </div>
            <div className="mb-6">
              <input
                className="rounded w-full py-2 px-3 bg-gray-700"
                type="password"
                placeholder="Password"
              />
            </div>
            <button
              className="bg-gray-700 w-full text-sm font-bold py-2 px-4 rounded"
              type="button"
            >
              Sign In
            </button>
            <div className="my-2 flex justify-end">
              <a className="text-sm" href="#">
                Forget Password?
              </a>
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );

  const RegisterContent = () => {
    const {
      register,
      formState: { errors },
      handleSubmit,
      getValues,
    } = useForm();

    // TODO

    const onValidSubmit = (data: any) => {
      console.log(data);
    };
    const onInvalidSubmit = (data: any) => {
      console.log(data);
    };

    return (
      <>
        <h2 className="text-center text-2xl">Register</h2>
        <ContinueWithGoogle />
        <div className="m-4">
          <form
            className="my-4 opacity-20"
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
          >
            <fieldset disabled={true}>
              <div className="mb-4">
                <input
                  className="rounded w-full py-2 px-3 bg-gray-700"
                  placeholder="Username"
                  {...register("username", {
                    required: "Username is required.",
                    minLength: {
                      value: 5,
                      message: "Username must have at least 5 characters.",
                    },
                    maxLength: {
                      value: 32,
                      message: "Username must have max 32 characters.",
                    },
                  })}
                />
                {errors.username && (
                  <p className="text-xs text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <input
                  className="rounded w-full py-2 px-3 bg-gray-700"
                  placeholder="Email"
                  type="text"
                  {...register("email", {
                    required: "You must specify a email.",
                    pattern: {
                      value:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Invalid email.",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  className="rounded w-full py-2 px-3 bg-gray-700"
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "You must specify a password.",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters.",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <input
                  className="rounded w-full py-2 px-3 bg-gray-700"
                  type="password"
                  placeholder="Confirm Password"
                  {...register("passwordConfirmation", {
                    required: "Please confirm password.",
                    validate: {
                      matchesPreviousPassword: (value) => {
                        const { password } = getValues();
                        return password === value || "Passwords should match!";
                      },
                    },
                  })}
                />
                {errors.passwordConfirmation && (
                  <p className="text-xs text-red-500">
                    {errors.passwordConfirmation.message}
                  </p>
                )}
              </div>
              <input
                className="bg-gray-700 text-sm w-full mt-2 cursor-pointer font-bold py-2 px-4 rounded"
                type="submit"
                value="Sign Up"
              />
            </fieldset>
          </form>
        </div>
      </>
    );
  };

  const MainContent = () => (
    <>
      <h2 className="text-center text-2xl">MoviApp Account</h2>
      <div className="my-12">
        <div className="flex flex-col gap-6">
          <div
            onClick={() => setScene(2)}
            className="p-4 bg-gray-700 rounded-md cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex items-center gap-3 -ml-1.5">
                <BiLogIn className="text-3xl" />
                <span className="text-xl opacity-80">Sign In</span>
              </div>
              <div className="ml-auto">
                <IoIosArrowForward className="text-xl" />
              </div>
            </div>
          </div>
          <div
            onClick={() => setScene(3)}
            className="p-4 bg-gray-700 rounded-md cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <BiUserPlus className="text-3xl" />
                <span className="text-xl opacity-80">Create an account</span>
              </div>
              <div className="ml-auto">
                <IoIosArrowForward className="text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        handleCloseClick={(e) => {
          e.preventDefault();
          setShowModal(false);
          setScene(1);
        }}
      >
        {scene !== 1 && (
          <div className="-mt-3 -ml-3">
            <button onClick={() => setScene(1)}>
              <IoIosArrowBack className="text-xl" />
            </button>
          </div>
        )}

        {scene === 1 ? (
          <MainContent />
        ) : scene === 2 ? (
          <LoginContent />
        ) : scene === 3 ? (
          <RegisterContent />
        ) : null}
      </Modal>
    </>
  );
};
export default LoginRegisterModal;
