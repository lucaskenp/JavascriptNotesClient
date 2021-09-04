import React, { Fragment, useEffect, useState } from 'react';
import { Column, Button } from "rbx";
import "../../styles/notes.scss";
import { push as Menu } from 'react-burger-menu'
import List from "../notes/list";
import NotesService from '../../services/notes';
import Editor from "../notes/editor";
import Search from "../notes/search";


const Notes = (props) => {
    const [notes, setNotes] = useState([]);
    const [current_note, setCurrentNote] = useState({ title: "", body: "", id: "" });

    async function fetchNotes() {
        const response = await NotesService.index();
        if (response.data.length >= 1) {
            setNotes(response.data.reverse());
            setCurrentNote(response.data[0]);
        } else {
            setNotes([]);
        }
    }
    const createNote = async (params) => {
        const note = await NotesService.create();
        fetchNotes();
    }

    const selectNote = (id) => {
        const note = notes.find((note) => {
            return note._id == id;
        })
        setCurrentNote(note);
    }
    const deleteNotes = async (note) => {
        await NotesService.delete(note._id);
        fetchNotes();
    }
    const updateNotes = async (oldNote, params) => {
        const updateNote = await NotesService.update(oldNote._id, params);
        const index = notes.indexOf(oldNote);
        const newNotes = notes;
        newNotes[index] = updateNote.data;
        setNotes(newNotes);
        setCurrentNote(updateNote.data);
    }

    const searchNotes = async (query) => {
        const response = await NotesService.search(query);
        setNotes(response.data);
    }
    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <Fragment>
            <Column.Group className="notes" id="notes">
                <Menu
                    pageWrapId={"notes-editor"}
                    isOpen={props.isOpen}
                    onStateChange={(state) => props.setIsOpen(state.isOpen)}
                    disableAutoFocus
                    outerContainerId={"notes"}
                    customBurgerIcon={false}
                    customCrossIcon={false}
                >
                    <Column.Group>
                        <Column size={10} offset={1}>
                            <Search searchNotes={searchNotes} fetchNotes={fetchNotes} />
                        </Column>
                    </Column.Group>
                    <List
                        notes={notes}
                        selectNote={selectNote}
                        createNote={createNote}
                        deleteNotes={deleteNotes}
                        current_note={current_note} />

                </Menu>


                <Column size={12} className="notes-editor" id="notes-editor">
                    <Editor
                        updateNotes={updateNotes}
                        note={current_note} />
                </Column>
            </Column.Group>
        </Fragment>
    )
}

export default Notes;