import React from "react";
import styles from "./Navbar.module.css";
import Image from "next/image";
import logo from "../../../assets/logo.png";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Image src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default Navbar;
