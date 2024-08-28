"use client";
import React, { useEffect, useState } from "react";
import styles from "./Notes.module.css";
import Image from "next/image";
import noteslogo from "../../../assets/noteslogo.png";
import search from "../../../assets/search.png";
import NotesCard from "../NotesCard/NotesCard";
import { useDispatch, useSelector } from "react-redux";
import {
  setHasMore,
  setNewNotesMode,
  setNotes,
  setPage,
  setSelectedNote,
} from "@/app/redux/notesSlice";
import { useRouter } from "next/navigation";
import { RingLoader } from "react-spinners";

const Notes = ({ isMobile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [MoreLoading, setMoreLoading] = useState(false);
  const { hasMore, page } = useSelector((state) => state.notes);

  const fetchMoreNotes = async (page) => {
    setMoreLoading(true);
    const response = await fetch(
      `http://localhost:5000/api/notes?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }

    const data = await response.json();

    if (data.total <= notes.length) {
      dispatch(setHasMore(false));
    }

    if (page === 1) {
      dispatch(setNotes(data.data));
    } else {
      dispatch(setNotes([...notes, ...data.data]));
    }

    // Check if more notes are available
    if (data.data.length === 0) {
      dispatch(setHasMore(false));
    }

    setMoreLoading(false);
  };

  const fetchMoreData = async () => {
    if (!hasMore) {
      return;
    }

    const nextPage = page + 1;
    dispatch(setPage(nextPage));
    await fetchMoreNotes(nextPage);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCollapse = () => {
    if (query === "") {
      setIsExpanded(false);
    }
  };

  const filterNotes = () => {
    return notes.filter((note) =>
      note.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  const { notes } = useSelector((state) => state.notes);
  const selectedNote = useSelector((state) => state.selectedNote);

  const fetchNotes = async () => {
    setLoading(true);
    dispatch(setPage(1));
    dispatch(setHasMore(true));
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

    setLoading(false);
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    dispatch(setNotes(filterNotes()));

    if (query === "") {
      fetchNotes();
    }
  }, [query]);

  const handleNewTodo = () => {
    dispatch(setSelectedNote(null));
    dispatch(setNewNotesMode(true));

    if (isMobile) {
      router.push(`/create`);
    }
  };

  return (
    <div className={styles.notes}>
      <div className={styles.note_buttons}>
        <button className={styles.note_button} onClick={handleNewTodo}>
          <Image src={noteslogo} alt="logo" />
          Todo
        </button>
        <div
          className={`${styles.searchContainer} ${
            isExpanded ? styles.expanded : ""
          }`}
        >
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search..."
            value={query}
            onChange={handleChange}
            onBlur={handleCollapse}
          />
          <button className={styles.searchButton} onClick={handleExpand}>
            <Image src={search} alt="logo" />
          </button>
        </div>
      </div>

      <div className={styles.notes_container}>
        {loading ? (
          <RingLoader color="#36d7b7" loading={loading} size={50} />
        ) : (
          notes?.map((note) => (
            <NotesCard
              isMobile={isMobile}
              note={note}
              id={note._id}
              key={note._id}
              title={note.title}
              description={note.description}
              date={formatDate(note.date)}
            />
          ))
        )}
        {MoreLoading ? (
          <RingLoader color="#36d7b7" loading={MoreLoading} size={50} />
        ) : (
          ""
        )}
        <button onClick={fetchMoreData} className={styles.load_more_button}>
          {hasMore ? "Load More" : "You have reached the end"}
        </button>
      </div>
    </div>
  );
};

export default Notes;
