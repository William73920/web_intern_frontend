"use client";

import styles from "./page.module.css";
import Notes from "./components/Notes/Notes";
import NotesForm from "./components/NotesForm/NotesForm";
import { store } from "./store";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Provider store={store}>
      <main className={styles.main}>
        <SnackbarProvider>
          <div className={styles.notes_container}>
            <Notes isMobile={isMobile} />
            {!isMobile && <NotesForm isMobile={isMobile} />}
          </div>
        </SnackbarProvider>
      </main>
    </Provider>
  );
}
