import React, { useState, useEffect } from "react";
import "./App.css";
import { ListItem, List } from "@material-ui/core";
import DeleteOutlineSharpIcon from "@material-ui/icons/DeleteOutlineSharp";
import DoneSharpIcon from "@material-ui/icons/DoneSharp";

function App() {
	const [todos, setTodos] = useState([]);

	const addTodo = e => {
		const newTodo = document.querySelector(".Todo__add-input");
		let updatedTodos = [...todos];
		updatedTodos.push(newTodo.value);

		setTodos(updatedTodos);
		renderTodo();
		newTodo.value = "";
	};

	const renderTodo = () => {};

	const removeTodo = e => {
		let updatedTodos = [...todos].filter(
			todo => todo !== e.currentTarget.dataset.todo
		);
		setTodos(updatedTodos);
	};

	const markAsDone = e => {
		const classes = e.currentTarget.parentElement.parentElement.classList;

		if (Array.from(classes).indexOf("Todo__item--done") !== -1) {
			classes.remove("Todo__item--done");
		} else {
			classes.add("Todo__item--done");
		}
	};

	useEffect(() => {}, [todos]);

	return (
		<div className="Todo">
			<h1 className="Todo__header">What are you planning to do today?</h1>

			<div className="Todo__new-item">
				<input
					className="Todo__add-input"
					type="text"
					placeholder="Buy some groceries"
				/>
				<button className="Todo__add-button" type="button" onClick={addTodo}>
					Add
				</button>
			</div>
			<List className="Todo__list">
				{todos.map((todo, index) => {
					return (
						<ListItem key={index} className="Todo__item">
							<div className="Todo__name">{todo}</div>
							<div className="Todo__actions">
								<DoneSharpIcon
									onClick={markAsDone}
									data-todo={todo}
									className="Todo__icon Todo__done-icon"
								></DoneSharpIcon>
								<DeleteOutlineSharpIcon
									onClick={removeTodo}
									data-todo={todo}
									className="Todo__icon Todo__delete-icon"
								></DeleteOutlineSharpIcon>
							</div>
						</ListItem>
					);
				})}
			</List>
		</div>
	);
}

export default App;
