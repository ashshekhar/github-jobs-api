import { useReducer, useEffect } from "react";
import axios from "axios";

const ACTIONS = {
	MAKE_REQUEST: "make-request",
	GET_DATA: "get-data",
	ERROR: "error",
};

const BASE_URL = "/positions.json";

function reducer(state, action) {
	switch (action.type) {
		case ACTIONS.MAKE_REQUEST:
			return { loading: true, jobs: [] };
		case ACTIONS.GET_DATA:
			return { ...state, loading: false, jobs: action.payload.jobs };
		case ACTIONS.ERROR:
			return {
				...state,
				loading: false,
				jobs: [],
				error: action.payload.error,
			};
	}
}

export default function FetchJobs(params, page) {
	const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

	useEffect(() => {
		dispatch({ type: ACTIONS.MAKE_REQUEST });
		axios
			.get(BASE_URL, { params: { markdown: true, page: page, ...params } })
			.then((response) => {
				dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: response.data } });
			})
			.catch((error) => {
				dispatch({ type: ACTIONS.ERROR, payload: { error: error } });
			});
	}, [params, page]);

	return state;
}
