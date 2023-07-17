import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/Card.jsx'
import Header from './components/Header';

function App() {

	const [name, setName] = useState('');
	const [time, setTime] = useState('');
	const [cards, setCards] = useState([]);

	function handleNameChange(e) {
		setName(e.target.value)
	}

	function handleTimeChange(e) {
		setTime(e.target.value)
	}



	function handleSubmit() {
		const newCard = {
			name: name,
			time: time,
			check: false,
			// time: new Date().toLocaleTimeString("pt-br",{
			// 	hour:'2-digit',
			// 	minute:'2-digit',
			// 	second:'2-digit',
			// })
		};

		fetch('http://localhost:3000/cards', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(newCard)
		  })
			.then(response => {
			  if (response.ok) {
				setCards(prevState => [...prevState, newCard])
				console.log('Card adicionado com sucesso!');
				setName('');
				setTime('');
			  } else {
				console.error('Erro ao adicionar o card:', response.status);
			  }
			})
			.catch(error => {
			  console.error('Erro ao adicionar o card:', error);
			});

		// setCards(prevState => [...prevState, newCard]);
		// setName('')
		// setTime('')

	}



	function handleCheck(index) {
		const updatedCards = [...cards];
		updatedCards[index].check = !updatedCards[index].check;
		setCards(updatedCards);
	}

	function handleTrash(index) {
		const updatedCards = [...cards];
		updatedCards.splice(index, 1); // Remove o card do array usando splice
		setCards(updatedCards);
	}

	function handleClearAll() {
		setCards([]); // Define o array de cards como vazio
	}

	// useEffect(() => {
	// console.log('Use Effect Foi ativado')
	// },[]);

	return (
		<div className='container'>
			<Header handleClearAll={handleClearAll} />
			<div className='input'>
				<input type='text' placeholder='Digite a Tarefa' value={name} onChange={handleNameChange} />
				<input type='time' placeholder='Digite o Horário Aproximado' value={time} onChange={handleTimeChange} />
			</div>
			<button type='button' onClick={handleSubmit}>Adicionar</button>
			{
				cards.map((card, index) => <Card
					key={card.time}
					name={card.name}
					time={card.time}
					check={card.check}
					handleChecked={() => handleCheck(index)}
					handleTrash={() => handleTrash(index)}
					handleClearAll={handleClearAll}
				/>)

			}
		</div>
	)
}

export default App
