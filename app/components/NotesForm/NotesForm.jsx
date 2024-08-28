"use client";
import React, { useEffect, useState } from "react";
import styles from "./NotesForm.module.css";
import deleteLogo from "../../../assets/delete.png";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import {
  setHasMore,
  setNewNotesMode,
  setNotes,
  setPage,
  setSelectedNote,
} from "@/app/redux/notesSlice";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

const NotesForm = () => {
  const { selectedNote } = useSelector((state) => state.notes);
  const [quillvalue, setQuillvalue] = useState(selectedNote?.description);
  const { newNotesMode } = useSelector((state) => state.notes);
  const { notes } = useSelector((state) => state.notes);
  const { enqueueSnackbar } = useSnackbar();
  const { hasMore, page } = useSelector((state) => state.notes);

  const router = useRouter();

  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setQuillvalue(selectedNote?.description);
  }, [selectedNote]);

  const handleChange = (name, value) => {
    dispatch(setSelectedNote({ ...selectedNote, [name]: value }));
  };

  const fetchNotes = async () => {
    dispatch(setPage(1));

    dispatch(setHasMore(true));
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();

      // setNotes(data.data);
      dispatch(setNotes(data.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      const data = await response.json();
      fetchNotes();
      dispatch(
        setSelectedNote(notes.length === 1 ? null : notes[notes.length - 1])
      );

      if (notes.length === 1) {
        dispatch(setNewNotesMode(true));
        dispatch(setSelectedNote(null));
      }

      enqueueSnackbar("Note deleted successfully", { variant: "success" });

      if (isMobile) {
        router.push(`/`);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to delete note", { variant: "error" });
    }
  };

  const handleEdit = async () => {
    try {
      if (!newNotesMode) {
        const response = await fetch(
          `http://localhost:5000/api/notes/${selectedNote._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: selectedNote.title,
              description: quillvalue,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to edit note");
        }

        const data = await response.json();
        fetchNotes();

        if (isMobile) {
          router.push(`/`);
        }

        enqueueSnackbar("Note edited successfully", { variant: "success" });
      } else if (newNotesMode) {
        const response = await fetch("http://localhost:5000/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: selectedNote.title,
            description: quillvalue,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to create note");
        }

        const data = await response.json();
        fetchNotes();

        enqueueSnackbar("Note created successfully", { variant: "success" });

        if (isMobile) {
          router.push(`/`);
        }
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to edit note", { variant: "error" });
    }
  };
  return (
    <div className={styles.notes_form}>
      {isMobile && (
        <button
          className={styles.notes_form_button_back}
          onClick={() => router.back()}
        >
          back
        </button>
      )}
      <div className={styles.notes_form_header}>
        <input
          type="text"
          className={styles.notes_form_input}
          value={selectedNote?.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          name="title"
          placeholder="Title"
        />{" "}
        {!newNotesMode && (
          <button className={styles.notes_form_button} onClick={handleDelete}>
            <Image src={deleteLogo} alt="logo" />
          </button>
        )}
      </div>
      <div className={styles.notes_form_textarea}>
        <ReactQuill
          placeholder="Write something amazing..."
          value={quillvalue}
          onChange={setQuillvalue}
          name="description"
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "link",
          ]}
        />
      </div>
      <button className={styles.notes_form_button_save} onClick={handleEdit}>
        Save
      </button>
    </div>
  );
};

export default NotesForm;
