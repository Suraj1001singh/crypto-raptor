import Head from "next/head";
import styles from "../styles/Home.module.css";
import Main from "../components/Main";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { HashLoader } from "react-spinners";
import { Modal, ModalOverlay, ModalContent, ModalFooter } from "@chakra-ui/react";


export default function Home() {
  
  const { isLoading } = useContext(AppContext);

  const style = {
    section: "max-w-[1200px] h-screen  m-auto",
    container: "flex flex-row w-full h-full",
    leftContainer: "flex flex-col basis-1/4  h-full shrink-0",
    rightContainer: "flex flex-col w-full bg-gray-200 h-full shrink-1 p-3",
    rightTopContainer: "flex w-full h-[3rem]  ",
    modalOverlay: "flex flex-col items-center",
    modalContent: "flex flex-col w-[15rem] h-[15rem] items-center justify-center ",
  };

  return (
    <div className={style.section}>
      <div className={style.container}>
        <div className={style.leftContainer}>
          <Sidebar />
        </div>
        <div className={style.rightContainer}>
          <div className={style.rightTopContainer}>
            <Navbar />
          </div>
          <Main />
        </div>
      </div>
      {isLoading && (
        <Modal isCentered isOpen={isLoading}>
          <ModalOverlay />
          <ModalContent className={style.modalContent}>
            <HashLoader size={150} />
            <ModalFooter>
              <h3>Connecting to wallet...</h3>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
