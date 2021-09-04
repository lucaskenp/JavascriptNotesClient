import React, { Fragment, useEffect, useState } from 'react';
import { Column, Button } from "rbx";
import "../../styles/notes.scss";
import { push as Menu } from 'react-burger-menu'
import List from "../notes/list";
import NotesService from '../../services/notes';

const Notes = (props) => {
    const [notes, setNotes] = useState([]);
    const [current_note, setCurrentNote] = useState({ title: "", body: "", id: "" });

    async function fetchNotes() {
        const response = await NotesService.index();
        if (response.data.length >= 1) {
            setNotes(response.data.reverse());
            setCurrentNote(response.data[0]);
        }else{
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
    const deleteNotes = async(note) =>{
        await NotesService.delete(note._id);
        fetchNotes();
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
                    <List
                        notes={notes}
                        selectNote={selectNote}
                        createNote={createNote}
                        deleteNotes={deleteNotes}
                        current_note={current_note} />

                </Menu>


                <Column size={12} className="notes-editor" id="notes-editor">
                    Editor..
                </Column>
            </Column.Group>
        </Fragment>
    )
}

export default Notes;