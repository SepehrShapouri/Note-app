import NoteView from "./NoteView.js";
document.addEventListener("DOMContentLoaded",(e)=>{
    NoteView.setApp()
    NoteView.createNotes(NoteView.notes)
    NoteView.setBackGround()
    NoteView._setActiveTheme(NoteView._getRootStyle())
})
