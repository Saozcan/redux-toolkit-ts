import styles from '../styles/Home.module.css'
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../src/store";
import {add, remove, markCompleted} from "../src/features/todoSlice";
import {stat} from "fs";

export default function Home() {

    const todos = useAppSelector(state => state.todos);

    const [title, setTitle] = useState("");

    const dispatch = useAppDispatch();

    const onSave = () => {
        dispatch(add(title));
        setTitle("");
    }

    const onDelete = (id: string) => {
        dispatch(remove(id))
    }

    const onMark = (id: string) => {
        dispatch(markCompleted(id))
    }

  return (
    <>
        <div>
            <input name="title" onChange={e => setTitle(e.currentTarget.value)} />
            <button onClick={onSave}>Save</button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <button onClick={() => onMark(todo.id)}>{todo.completed ? "Mark Completed" : "Mark does not completed"}</button>
                        <button onClick={() => onDelete(todo.id)}>Delete</button>
                        <span>{todo.title}</span>
                    </li>
                ))}
            </ul>
        </div>

    </>
  )
}
