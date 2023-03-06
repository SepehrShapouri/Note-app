import Storage from "./Storage.js";
const noteList = document.querySelector(".note__list-items");
const addNoteBtn = document.querySelector(".notes__new-note");
const addNoteForm = document.querySelector(".notes__create");
const closeNoteForm = document.querySelector(".note__back");

const noteInputTitle = document.querySelector(".note__title");
const noteInputBody = document.querySelector(".note__body");
// pop up modal for saving note
const saveNoteBtn = document.querySelector(".note__save");
const saveNoteModal = document.querySelector(".notes__create-save");
// create new note picture toggles when there are no notes
const noteBackGround = document.querySelector(".notes__empty");
const noteBackGroundText = document.querySelector(".empty__text");
const notePreview = document.querySelector(".note__preview");
const previewContainer = document.querySelector(".preview");

// selectors for note edit form
const editNoteForm = document.querySelector(".notes__edit");
const editNoteTitle = document.querySelector(".edit-note__title");
const editNoteBody = document.querySelector(".edit-note__body");
const editNoteBtn = document.querySelector(".edit__save");
const editNoteModal = document.querySelector(".notes__edit-save");
const closeEditForm = document.querySelector(".edit-note__back");

const searchBtn = document.querySelector(".option__search");
const searchBar = document.querySelector(".search-bar");
const appTitle = document.querySelector(".header__title");
const themeBtn = document.querySelector(".option__theme");
const themeLogo = document.querySelector(".fa-regular");
class NoteView {
  constructor() {
    addNoteBtn.addEventListener("click", (e) => this._openNoteForm());
    closeNoteForm.addEventListener("click", (e) => this._closeNoteForm());
    closeEditForm.addEventListener("click", (e) => this._closeEditForm());
    saveNoteBtn.addEventListener("click", (e) => this.openSaveNote());
    searchBtn.addEventListener("click", (e) => this.searchNotes(e));
    themeBtn.addEventListener("click", (e) => this.setTheme());
    this.notes = [];
  }
  setApp() {
    this.notes = Storage.getAllNotes();
  }
  _openNoteForm() {
    addNoteForm.classList.add("notes__create-active");
  }
  _closeNoteForm() {
    addNoteForm.classList.remove("notes__create-active");
  }
  _openEditForm() {
    editNoteForm.classList.add("notes__edit-active");
  }
  _closeEditForm() {
    editNoteForm.classList.remove("notes__edit-active");
  }
  openEditNote(id, form) {
    const saveBtns = [...document.querySelectorAll(".btn")];
    document.querySelector(".preview-edit").style.display = "flex";
    editNoteModal.classList.add("notes__edit-save-active");
    saveBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (btn.classList.contains("edit-save-btn")) {
          this.editNote(id, form);
        } else if (btn.classList.contains("edit-discard-btn")) {
          this.closeEditNote();
        }
      });
    });
  }
  closeEditNote() {
    document.querySelector(".preview-edit").style.display = "none";
    saveNoteModal.classList.remove("notes__edit-save-active");
  }
  addNote() {
    const title = noteInputTitle.value;
    const body = noteInputBody.value;
    const newNote = { title, body };
    if (!title || !body) return;
    const color = Storage.setActiveColor();
    Storage.saveNote(newNote, color);
    this.notes = Storage.getAllNotes();
    this.createNotes(this.notes);
    this.confirmNote();
  }
  openSaveNote() {
    const saveBtns = [...document.querySelectorAll(".btn")];
    document.querySelector(".preview-save").style.display = "flex";
    saveNoteModal.classList.add("notes__create-save-active");
    saveBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (btn.classList.contains("save-btn")) {
          this.addNote();
        } else if (btn.classList.contains("discard-btn")) {
          this.closeSaveNote();
        }
      });
    });
  }
  closeSaveNote() {
    document.querySelector(".preview-save").style.display = "none";
    saveNoteModal.classList.remove("notes__create-save-active");
  }
  createNotes(notes) {
    let result = "";
    notes.forEach((note) => {
      result += `
            <li class="list__items" data-note-id="${
              note.id
            }" style=background-color:${note.color};>
    <h4 class="note-title" data-note-id=${note.id}>${note.title}</h4>
    <p class="small-note-body" data-note-id=${note.id}>${note.body}</p>
    <p class="updated" data-note-id=${note.id}>
    ${new Date(note.updated).toLocaleString("en-EN", {
      dateStyle: "short",
      timeStyle: "short",
    })} 
    </p>
    </li>`;
    });
    noteList.innerHTML = result;
    this.setBackGround();

    const allNotes = [...document.querySelectorAll(".list__items")];
    allNotes.forEach((note) => {
      note.addEventListener("click", (e) => this.activePreview(e, allNotes));
    });
  }
  activePreview(e, allNotes) {
    const activeId = e.target.dataset.noteId;
    console.log(activeId);
    const activeNote = this.findActiveNote(activeId);
    const date = new Date(activeNote.updated).toLocaleString("en-EN", {
      dateStyle: "short",
      timeStyle: "short",
    });
    let result = "";
    allNotes.forEach((note) => {
      result = `<h1 class="note-title">${activeNote.title}</h1>
      <p class="note-body">${activeNote.body}</p>
      <p class="updated preview-updated">${date}</p>
      <div class="preview-options">
      <span class="option note-back"><i class="fa-solid fa-arrow-left"></i></span>
      <span class="option delete-note" data-note-id="${activeId}"><i class="fa-solid fa-trash" data-note-id="${activeId}"></i></span>
      <span class="option edit-note"><i class="fa-solid fa-edit"></i></span>
  </div>`;
    });
    this.openNotePreview();
    notePreview.innerHTML = result;

    const closeNotePreviewBtn = document
      .querySelector(".note-back")
      .addEventListener("click", (e) => this.closeNotePreview());

    const deleteNoteBtn = document
      .querySelector(".delete-note")
      .addEventListener("click", (e) => this.deleteNote(activeId));

    const editNoteBtn = [...document.querySelectorAll(".edit-note")];
    editNoteBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => this.editNoteForm(activeId));
    });
  }
  setBackGround() {
    const noteList = document.querySelector(".note__list-items");
    if (noteList.childElementCount < 1) {
      document
        .querySelector(".notes__empty")
        .classList.add("notes__empty-active");
    } else {
      document
        .querySelector(".notes__empty")
        .classList.remove("notes__empty-active");
    }
  }
  findActiveNote(id) {
    const activeNote = this.notes.find((note) => {
      return parseInt(note.id) == parseInt(id);
    });
    return activeNote;
  }
  deleteNote(id) {
    Storage.deleteNote(id);
    this.notes = Storage.getAllNotes();
    this.createNotes(this.notes);
    this.closeNotePreview();
    this.resetNoteText();
  }
  createEditNoteInput(currentTitle, currentBody) {
    const editNoteForm = document.createElement("form");
    editNoteForm.classList.add("main-form");
    const editNoteTitle = document.createElement("input");
    const editNoteBody = document.createElement("textarea");
    editNoteBody.classList.add("form-input", "edit-note__body");
    editNoteTitle.classList.add("form-input", "edit-note__title");
    editNoteBody.setAttribute("rows", 8);
    editNoteTitle.type = "text";
    editNoteBody.value = currentBody;
    editNoteTitle.value = currentTitle;
    editNoteForm.appendChild(editNoteTitle);
    editNoteForm.appendChild(editNoteBody);
    return editNoteForm;
  }
  editNoteForm(id) {
    const activeNote = this.findActiveNote(id);
    const title = activeNote.title;
    const body = activeNote.body;
    const editNoteForm = this.createEditNoteInput(title, body);
    this._openEditForm();
    const editWrapper = document.querySelector(".notes__edit .notes__form");
    editWrapper.innerHTML = "";
    editWrapper.appendChild(editNoteForm);
    this.closeNotePreview();
    editNoteBtn.addEventListener("click", (e) =>
      this.openEditNote(id, editNoteForm)
    );
  }
  editNote(id, form) {
    const editForm = form;
    const newTitle = editForm.childNodes[0].value;
    const newBody = editForm.childNodes[1].value;
    const index = this.notes.findIndex(
      (note) => parseInt(note.id) == parseInt(id)
    );
    if (index !== -1) {
      this.notes[index].title = newTitle;
      this.notes[index].body = newBody;
      localStorage.setItem("notes", JSON.stringify(this.notes));
      this.notes = Storage.getAllNotes();
      this.createNotes(this.notes);
      this.closeEditNote();
      this._closeEditForm();
      this.setBackGround();
    }
  }
  closeNotePreview() {
    previewContainer.style.display = "none";
    notePreview.classList.remove("note__preview-active");
  }
  openNotePreview() {
    notePreview.classList.add("note__preview-active");
    previewContainer.style.display = "flex";
  }
  confirmNote() {
    noteInputBody.value = "";
    noteInputTitle.value = "";
    this.closeSaveNote();
    this._closeNoteForm();
    this.setBackGround();
  }
  // search in notes
  searchNotes(e) {
    searchBar.classList.toggle("search-bar-active");
    appTitle.classList.toggle("title-Na");
    searchBar.addEventListener("input", (e) => this.filterNotes(e));
  }
  filterNotes(e) {
    const value = e.target.value;
    const filteredNotes = this.notes.filter((note) => {
      return note.title.toLowerCase().includes(value.toLowerCase());
    });
    if (noteList.childElementCount < 1) {
      noteBackGroundText.innerText = "No notes were found!";
    }
    this.createNotes(filteredNotes);
  }
  resetNoteText() {
    noteBackGroundText.innerText = "Create your first note!";
  }
  setTheme(e) {
    const darkMode = [
      "--main-color",
      "#252525",
      "--main-font",
      "white",
      "--secondary-color",
      "#3B3B3B",
      "--save-logo-color",
      "#d1d5b",
      "dark",
    ];
    const lightMode = [
      "--main-color",
      "#f1f5f9",
      "--main-font",
      "#252525",
      "--secondary-color",
      "#e2e8f0",
      "--save-logo-color",
      "#d1d5db",
      "light",
    ];
    themeLogo.classList.toggle("fa-moon");
    themeLogo.classList.toggle("fa-sun");
    if (themeLogo.classList.contains("fa-sun")) {
      this._setActiveTheme(darkMode);
    } else {
      this._setActiveTheme(lightMode);
    }
  }
  _setActiveTheme(theme) {
    document.body.style.setProperty(theme[0], theme[1]);
    document.body.style.setProperty(theme[2], theme[3]);
    document.body.style.setProperty(theme[4], theme[5]);
    document.body.style.setProperty(theme[6], theme[7]);
    this.saveRootStyle(theme);
  }
  saveRootStyle(style) {
    localStorage.setItem("root-style", JSON.stringify(style));
    console.log(style);
    if (style.includes("dark")) {
      themeLogo.classList.add("fa-sun");
      themeLogo.classList.remove("fa-moon");
    } else if (style.includes("light")) {
      themeLogo.classList.remove("fa-sun");
      themeLogo.classList.add("fa-moon");
    }
  }
  _getRootStyle() {
    return JSON.parse(localStorage.getItem("root-style"));
  }
}
export default new NoteView();
