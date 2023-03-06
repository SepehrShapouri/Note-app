export default class Storage {
  static getAllNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const sortedNotes = savedNotes.sort((a, b) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
    return sortedNotes;
  }
  static saveNote(noteToSave, color) {
    const savedNotes = Storage.getAllNotes();

    noteToSave.id = new Date().getTime();
    noteToSave.updated = new Date().toISOString();
    noteToSave.color = color;
    savedNotes.push(noteToSave);

    localStorage.setItem("notes", JSON.stringify(savedNotes));
  }
  static deleteNote(id) {
    const savedNotes = Storage.getAllNotes();
    const filteredNotes = savedNotes.filter((note) => {
      return parseInt(note.id) != parseInt(id);
    });
    localStorage.setItem("notes", JSON.stringify(filteredNotes));
  }
  static setActiveColor() {
    const colors = [
      "#dcfce7",
      "#f5d0fe",
      "#dbeafe",
      "#a5f3fc",
      "#fce7f3",
      "#06b6d4",
      "#d1fae5",
      "#ecfccb",
      "#fca5a5",
      "#d9f99d",
      "#99f6e4",
      "#d8b4fe",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
