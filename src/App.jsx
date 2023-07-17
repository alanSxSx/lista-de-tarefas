import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/Card.jsx'
import Header from './components/Header';

function App() {

	const [name, setName] = useState('');
	const [time, setTime] = useState('');
	const [cards, setCards] = useState([]);

	useEffect(() => {
		fetch('http://localhost:3000/cards')
			.then(response => response.json())
			.then(data => {
				setCards(data);
			})
			.catch(error => {
				console.error('Erro ao recuperar os cards:', error);
			});
	}, []);

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
		// const updatedCards = [...cards];
		// updatedCards.splice(index, 1); // Remove o card do array usando splice
		// setCards(updatedCards);

		const cardId = cards[index].id; // Certifique-se de ter uma propriedade `id` única para cada card

		fetch(`http://localhost:3000/cards/${cardId}`, {
			method: 'DELETE'
		})
			.then(response => {
				if (response.ok) {
					console.log('Card deletado com sucesso!');
					const updatedCards = [...cards];
					updatedCards.splice(index, 1);
					setCards(updatedCards);
				} else {
					console.error('Erro ao deletar o card:', response.status);
				}
			})
			.catch(error => {
				console.error('Erro ao deletar o card:', error);
			});

	}

	function handleClearAll() {

		fetch('http://localhost:3000/cards', {
			method: 'DELETE'
		  })
			.then(response => {
			  if (response.ok) {
				console.log('Todos os cards foram deletados com sucesso!');
				setCards([]); // Define o array de cards como vazio
			  } else {
				console.error('Erro ao deletar os cards:', response.status);
			  }
			})
			.catch(error => {
			  console.error('Erro ao deletar os cards:', error);
			});
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
