import React from "react";
import axios from "axios";

let journlerURL = "http://localhost:3000/journals";

function App() {
  // The below code lines (line 9 to line 15) helps to configure todaysDate.
  const currentDate = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDateAsNumber = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  let todaysDate = `${currentDateAsNumber} ${month} ${year}`;

  // Call React Hook useState to define state for
  // journalId, date, journalDate, mood, title, writeup, journalCollection and journlerMode
  // the default value of journlerMode state can be set to 'editor' to start the app in edit mode
  const [journalId, setJournalId] = React.useState(null);
  const [date, setDate] = React.useState("");
  const [journalDate, setJournalDate] = React.useState(todaysDate);
  const [mood, setMood] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [writeup, setWriteup] = React.useState("");
  const [journalCollection, setJournalCollection] = React.useState([]);
  const [journlerMode, setJournlerMode] = React.useState("editor");

  React.useEffect(() => {
    async function fetchJournals() {
      try {
        await axios.get(journlerURL);
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    }

    fetchJournals();
  }, []);

  // define event handler function onTitleChanged() to update title state
  function onTitleChanged(e) {
    setTitle(e.target.value);
  }

  // define event handler function onWriteUpChanged() to update writeUp state
  function onWriteUpChanged(e) {
    setWriteup(e.target.value);
  }

  // define event handler function onMoodChanged() to update onMoodChange state
  function onMoodChanged(mood) {
    setMood(mood.target.value);
  }

  // define event handler function onJournalClicked() to update journal state
  // with the provided journal item and change journlerMode to 'viewer'
  function onJournalClicked(journal) {
    setJournalId(journal.id);
    setDate(journal.date);
    setJournalDate(journal.journalDate);
    setMood(journal.mood);
    setTitle(journal.title);
    setWriteup(journal.writeup);
    setJournalCollection(journal.journalCollection);
    setJournlerMode("viewer");
  }

  // define event handler function saveJournal() to save journal when add or edit is requested
  // make server api call using axios to perform save operation
  // post save, update journalCollection state with new or edited journal entry
  async function saveJournal(event) {
    event.preventDefault();

    const journalData = {
      id: journalId || Date.now(),
      date: todaysDate,
      title: title,
      writeup: writeup,
      mood: mood,
    };

    console.log(journalData);

    try {
      await axios.post(journlerURL, journalData);
    } catch (error) {
      console.log(error);
    } finally {
      //after the trycatch and only after this block must execute
      setJournalCollection((prevJournalCollection) => {
        const updatedCollection = [...prevJournalCollection, journalData];
        return updatedCollection;
      });
      console.log(journalCollection);
    }
  }

  // define function to filter journalCollection() by mood value provide
  function getMoodStats(mood) {
    const filteredByMoods = journalCollection.find(
      (journal) => journal.mood === mood
    );
    return filteredByMoods;
  }

  // define event handler function cancel() to cancel requested save operation
  function cancel() {
    setMood("");
    setTitle("");
    setWriteup("");
  }

  // define event handler function deleteJournal() to delete journal by the id provided
  // make server api call using axios to perform delete operation
  // post delete, update journalCollection state to remove deleted journal item
  async function deleteJournal(id) {
    try {
      await axios.delete(`${journlerURL}/${id}`);
    } catch (error) {
      console.log("Error deleting journal entry: ", error);
    }
    const updateJournalCollection = journalCollection.filter(
      (journal) => journal.id != id
    );
    setJournalCollection(updateJournalCollection);
  }

  // define event handler function editJournal() to set the journlerMode to 'editor'
  function editJournal(id) {
    const journalToEdit = journalCollection.find(
      (journal) => journal.id === id
    );
    if (journalToEdit) {
      setJournalId(journalToEdit.id);
      setDate(journalToEdit.date);
      setJournalDate(journalToEdit.journalDate);
      setMood(journalToEdit.mood);
      setTitle(journalToEdit.title);
      setWriteup(journalToEdit.writeup);
      setJournlerMode("editor");
    }
  }

  // DO NOT MODIFY THE BELOW CODE, ELSE THE TEST CASES WILL FAIL

  return (
    <div className="app-container">
      <div id="journal-branding__title">
        <h1 data-testid="journal-branding__title">Journler</h1>
      </div>
      <div id="journal-catalog">
        <h2>Mood Stats</h2>
        <div id="journal-catalog__mood-stats">
          <div className="mood-stat">
            <div className="mood">
              <i className="far fa-smile-beam"></i>
            </div>
            <div className="stat">{getMoodStats("Excited")}</div>
          </div>
          <div className="mood-stat">
            <div className="mood">
              <i className="far fa-smile"></i>
            </div>
            <div className="stat">{getMoodStats("Happy")}</div>
          </div>
          <div className="mood-stat">
            <div className="mood">
              <i className="far fa-surprise"></i>
            </div>
            <div className="stat">{getMoodStats("Surprised")}</div>
          </div>
          <div className="mood-stat">
            <div className="mood">
              <i className="far fa-frown"></i>
            </div>
            <div className="stat">{getMoodStats("Sad")}</div>
          </div>
          <div className="mood-stat">
            <div className="mood">
              <i className="far fa-angry"></i>
            </div>
            <div className="stat">{getMoodStats("Angry")}</div>
          </div>
        </div>
        <h2>Journals</h2>
        {journalCollection.length > 0 && (
          <ul id="journal-catalog__collection">
            {journalCollection.map((journal) => (
              <li
                key={journal.id}
                onClick={onJournalClicked.bind(null, journal)}
                className="journal-catalog__collection--journal data-testid='journalTestId'"
              >
                <h3>
                  {journal.title} - {journal.date}
                </h3>
                <p>{journal.writeup}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className={journlerMode === "viewer" ? "show" : "hide"}
        id="journal-viewer"
      >
        <h1 id="journal-viewer__date">{date}</h1>
        <div id="journal-viewer__mood">
          <div className={mood === "Excited" ? "mood show" : "hide"}>
            <i className="far fa-smile-beam fa-fw"></i>
          </div>
          <div className={mood === "Happy" ? "mood show" : "hide"}>
            <i className="far fa-smile fa-fw"></i>
          </div>
          <div className={mood === "Surprised" ? "mood show" : "hide"}>
            <i className="far fa-surprise fa-fw"></i>
          </div>
          <div className={mood === "Sad" ? "mood show" : "hide"}>
            <i className="far fa-frown fa-fw"></i>
          </div>
          <div className={mood === "Angry" ? "mood show" : "hide"}>
            <i className="far fa-angry fa-fw"></i>
          </div>
        </div>
        <h3 id="journal-viewer__title-viewer">{title}</h3>
        <div id="journal-viewer__writeup-viewer">{writeup}</div>
        <div id="journal-viewer__actions">
          <button
            className="primary"
            onClick={editJournal.bind(null, journalId)}
            id="edit_button"
          >
            Edit
          </button>
          <button
            onClick={deleteJournal.bind(null, journalId)}
            id="delete_button"
          >
            Delete
          </button>
        </div>
      </div>

      <div
        className={journlerMode === "editor" ? "show" : "hide"}
        id="journal-editor"
      >
        <h1 id="journal-editor__date" data-testid="journal-editor__date">
          {todaysDate}
        </h1>
        <h2 id="journal-editor__mood-label">How's your Mood Today</h2>
        <div id="journal-editor__mood">
          <button
            className={mood === "Excited" ? "selectedMood" : "mood"}
            onClick={setMood.bind(null, "Excited")}
          >
            <i className="far fa-smile-beam fa-fw"></i>
          </button>
          <button
            className={mood === "Happy" ? "selectedMood" : "mood"}
            onClick={setMood.bind(null, "Happy")}
          >
            <i className="far fa-smile fa-fw"></i>
          </button>
          <button
            className={mood === "Surprised" ? "selectedMood" : "mood"}
            onClick={setMood.bind(null, "Surprised")}
          >
            <i className="far fa-surprise fa-fw"></i>
          </button>
          <button
            className={mood === "Sad" ? "selectedMood" : "mood"}
            onClick={setMood.bind(null, "Sad")}
          >
            <i className="far fa-frown fa-fw"></i>
          </button>
          <button
            className={mood === "Angry" ? "selectedMood" : "mood"}
            onClick={setMood.bind(null, "Angry")}
          >
            <i className="far fa-angry fa-fw"></i>
          </button>
        </div>
        <input
          value={title}
          onChange={onTitleChanged}
          placeholder="What's on your Mind?"
          type="text"
          id="journal-editor__title-editor"
        />
        <textarea
          value={writeup}
          onChange={onWriteUpChanged}
          placeholder="I am all excited to know how was your day like!"
          name="journal-editor__writeup-editor"
          id="journal-editor__writeup-editor"
          cols="30"
          rows="20"
        ></textarea>
        <div id="journal-editor__actions">
          <button className="primary" id="save_button" onClick={saveJournal}>
            Save
          </button>
          <button onClick={cancel} id="cancel_button">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
