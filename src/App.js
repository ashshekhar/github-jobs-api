import React, { useState } from "react";
import FetchJobs from "./FetchJobs";
import { Container } from "react-bootstrap";
import Job from "./Job";

function App() {
	const [params, setParams] = useState({});
	const [page, setPage] = useState(1);
	const { jobs, loading, error } = FetchJobs(params, page);
	return (
		<Container className="my-4">
			{loading && <h1>Loading jobs...</h1>}
			{error && <h1>Error loading jobs</h1>}
			{jobs.map((job) => {
				return <Job key={job.id} job={job} />;
			})}
		</Container>
	);
}

export default App;
