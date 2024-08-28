import React from "react";
import styles from "./NotesCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setNewNotesMode, setSelectedNote } from "../../redux/notesSlice";
import { useRouter } from "next/navigation";

const NotesCard = ({ date, note, id, isMobile }) => {
  const selectedNote = useSelector((state) => state.notes.selectedNote);
  const router = useRouter();

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setSelectedNote(note));
    dispatch(setNewNotesMode(false));

    if (isMobile) {
      router.push(`/create`);
    }
  };

  function trimAndLimitCharacters(str, maxLength = 3) {
    // Remove HTML tags
    const cleanStr = str.replace(/<\/?[^>]+(>|$)/g, "");

    // Check if the string needs to be trimmed
    if (cleanStr.length > maxLength) {
      return cleanStr.slice(0, maxLength) + "...";
    }

    // Otherwise, return the full string
    return cleanStr;
  }
  return (
    <div
      className={styles.notes_card}
      onClick={handleClick}
      style={{
        border: selectedNote?._id === note._id ? "1px solid black" : "none",
      }}
    >
      <div className={styles.title}>
        {trimAndLimitCharacters(note.title, 20)}
      </div>
      <div className={styles.description}>
        <p style={{ margin: 0 }} className={styles.description_text}>
          {trimAndLimitCharacters(note.description)}
        </p>
        <div className={styles.date}>
          <div className={styles.date_text}>{date} </div>
        </div>
      </div>
    </div>
  );
};

export default NotesCard;
