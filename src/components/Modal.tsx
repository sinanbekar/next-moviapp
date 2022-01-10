import React from "react";
// @ts-ignore
import ReactDOM from "react-dom";
import { IoMdClose } from "react-icons/io";
import useOnClickOutside from "@/hooks/useOnClickOutside";

interface Props {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseClick?: (
    e: React.MouseEvent<HTMLElement> | MouseEvent
  ) => void | null;
  title?: string;
  reRenderOnCloseOpen?: boolean;
}

const Modal: React.FC<Props> = ({
  showModal,
  setShowModal,
  handleCloseClick = null,
  children,
  title = "",
  reRenderOnCloseOpen = true,
}) => {
  if (handleCloseClick === null) {
    handleCloseClick = (e) => {
      e.preventDefault();
      setShowModal(false);
    };
  }
  const ref = useOnClickOutside(handleCloseClick);

  const modalContent = (showModal || !reRenderOnCloseOpen) && (
    <div
      className={`fixed ${
        !showModal && !reRenderOnCloseOpen ? "hidden" : ""
      } top-0 left-0 w-full h-full z-50 flex justify-center items-center`}
    >
      <div
        ref={ref}
        className="bg-movidark w-[500px] h-[600px] rounded-2xl p-2 text-white"
      >
        <div className="relative">
          <div className="absolute right-0 m-3">
            <button onClick={handleCloseClick}>
              <IoMdClose className="text-xl" />
            </button>
          </div>
        </div>
        <div className="px-8 py-2">
          <div className="font-bold text-lg py-2">{title}</div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );

  if (typeof window !== "undefined") {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
};

export default Modal;
