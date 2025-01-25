import nlp from 'compromise';
import { messages } from './consts';
import { useEffect, useRef, useState } from 'react';

function App() {
	function getResponse(userInput: string) {
		let bestMatch = { index: -1, score: -1 };

		const normalizedInput = nlp(userInput).out('text');

		// Compare each message with the normalized user input using a simple match score
		messages.forEach((message: string, index: number) => {
			const score = nlp(message).match(normalizedInput).length;
			if (score > bestMatch.score) {
				bestMatch = { index, score };
			}
		});

		if (bestMatch.score === 0) {
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			return cleanMessage(randomMessage);
		}

		if (bestMatch.index !== -1) {
			return cleanMessage(messages[bestMatch.index]);
		} else {
			return "mafahamtsch 3awadaly sitopli";
		}
	}

	function cleanMessage(message: string) {
		return message.replace(/\(.*?\)/g, '').trim();
	}

	const [message, setMessage] = useState('');
	const [messageLog, setMessageLog] = useState<any[]>([]);
	const messageLogRef = useRef<HTMLDivElement>(null); // Reference to the message log container

	const handleInputChange = (e: any) => {
		setMessage(e.target.value);
	};

	// Handle message submission
	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (message.trim()) {
			setMessageLog((prevLog) => [...prevLog, { sender: 'user', text: message }]);
			const response = getResponse(message);

			setMessage('');
			await sleep(500);

			typeResponse(response);
		}
	};

	function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	// Function to simulate the typing effect
	function typeResponse(response: string) {
		let index = 0;
		const newBotMessage = { sender: 'bot', text: '' };
		setMessageLog((prevLog) => [...prevLog, newBotMessage]);

		const typingInterval = setInterval(() => {
			setMessageLog((prevLog) => {
				const updatedLog = [...prevLog];
				updatedLog[updatedLog.length - 1].text = response.substring(0, index + 1);
				return updatedLog;
			});

			index += 1;

			if (index === response.length) {
				clearInterval(typingInterval);
			}
		}, 50); // Adjust the speed of typing (in ms)
	}

	// Scroll to the bottom when messageLog changes
	useEffect(() => {
		if (messageLogRef.current) {
			messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight;
		}
	}, [messageLog]);

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
			<div>
				<h1>Tminich: talk to minoucha</h1>
			</div>

			<div className="message-log-container" style={{ padding: '20px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
				<div
					className="message-log"
					style={{
						maxHeight: '500px',
						overflowY: 'auto',
						marginBottom: '10px',
						padding: '10px',
						display: 'flex',
						flexDirection: 'column',
						gap: '10px'
					}}
					ref={messageLogRef}
				>
					{messageLog.map((msg, index) => (
						<div
							key={index}
							style={{
								padding: '10px',
								borderRadius: '5px',
								display: 'flex',
								alignItems: "center",
								backgroundColor: msg.sender === 'user' ? '#303030' : 'transparent',
								alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
								textAlign: msg.sender === 'user' ? 'right' : 'left'
							}}
						>
							{msg.sender === 'user' ? "" : (
								<img
									src="/minich.png"
									alt="Minoucha"
									style={{
										width: '50px',
										height: '50px',
										borderRadius: '50%',
										marginRight: '10px'
									}}
								/>
							)}
							{msg.text}
						</div>
					))}
				</div>

				{/* Message input */}
				<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
					<input
						type="text"
						value={message}
						onChange={handleInputChange}
						placeholder="Type your message..."
						style={{ padding: '10px', marginBottom: '10px' }}
					/>
					<button type="submit" style={{ padding: '10px', backgroundColor: '#ADD8E6', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
						Send
					</button>
				</form>
			</div>
		</div>
	);
}

export default App;

