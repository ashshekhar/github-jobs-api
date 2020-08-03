import React, { useState } from "react";
import FetchJobs from "./FetchJobs";
import { Container } from "react-bootstrap";
import Job from "./Job";
import JobsPagination from "./JobsPagination";
import SearchForm from "./SearchForm";

function App() {
	const [params, setParams] = useState({});
	const [page, setPage] = useState(1);
	const { jobs, loading, error, hasNextPage } = FetchJobs(params, page);

	function handleParamChange(event) {
		const params = event.target.name;
		const value = event.target.value;
		setPage(1);
		setParams((prevParams) => {
			return { ...prevParams, [params]: value };
		});
	}
	return (
		<Container className="my-5">
			<h1 className="mb-4">GitHub Jobs</h1>
			<SearchForm params={params} onParamChange={handleParamChange} />
			<JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
			{loading && <h1>Loading jobs...</h1>}
			{error && <h1>Error loading jobs</h1>}
			{jobs.map((job) => {
				return <Job key={job.id} job={job} />;
			})}
			<JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
		</Container>
	);
}

export default App;
