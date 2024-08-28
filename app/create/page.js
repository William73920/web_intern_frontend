"use client";
import React from "react";
import NotesForm from "../components/NotesForm/NotesForm";
import { Provider } from "react-redux";
import { store } from "../store";

const page = () => {
  return (
    <Provider store={store}>
      <NotesForm />
    </Provider>
  );
};

export default page;
