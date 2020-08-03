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
		const cancelToken = axios.CancelToken.source;
		dispatch({ type: ACTIONS.MAKE_REQUEST });
		axios
			.get(BASE_URL, {
				cancelToken: cancelToken.token,
				params: { markdown: true, page: page, ...params },
			})
			.then((response) => {
				dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: response.data } });
			})
			.catch((error) => {
				if (axios.isCancel(error)) return;
				dispatch({ type: ACTIONS.ERROR, payload: { error: error } });
			});
		return () => {
			cancelToken.cancel();
		};
	}, [params, page]);

	return state;
}
