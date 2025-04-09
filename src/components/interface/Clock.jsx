import { useEffect, useState } from 'react';

const Clock = () => {
	const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
	const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-CA'));

	useEffect(() => {
		const timer = setInterval(() => {
			const now = new Date();
			setCurrentTime(now.toLocaleTimeString());
			setCurrentDate(now.toLocaleDateString('en-CA'));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<span className="fs-6 py-2 my-auto">
			{currentDate} {currentTime}
		</span>
	);
};

export default Clock;
