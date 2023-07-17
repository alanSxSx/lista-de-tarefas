import React from 'react'

import './Header.css'

export default function Header({handleClearAll}) {

	function Teste() {
		console.log('Teste Ativado')
	}
	return (
		<>
			<header className='header'>
				<div className='title'>
					<h1>Lista de Tarefas</h1>
				</div>
				<div className='trash'>
					<i class="fa-solid fa-trash" onClick={handleClearAll}></i>
				</div>
			</header>
		</>
	)
}
