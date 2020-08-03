import { useReducer, useEffect } from "react";
import axios from "axios";

const ACTIONS = {
	MAKE_REQUEST: "make-request",
	GET_DATA: "get-data",
	ERROR: "error",
	UPDATE_HAS_NEXT_PAGE: "update-has-next-page",
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
		case ACTIONS.UPDATE_HAS_NEXT_PAGE:
			return { ...state, hasNextPage: action.payload.hasNextPage };
		default:
			return state;
	}
}

export default function FetchJobs(params, page) {
	const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

	useEffect(() => {
		const cancelToken_1 = axios.CancelToken.source();
		dispatch({ type: ACTIONS.MAKE_REQUEST });
		axios
			.get(BASE_URL, {
				cancelToken: cancelToken_1.token,
				params: { markdown: true, page: page, ...params },
			})
			.then((response) => {
				dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: response.data } });
			})
			.catch((error) => {
				if (axios.isCancel(error)) return;
				dispatch({ type: ACTIONS.ERROR, payload: { error: error } });
			});
		const cancelToken_2 = axios.CancelToken.source();
		axios
			.get(BASE_URL, {
				cancelToken: cancelToken_2.token,
				params: { markdown: true, page: page + 1, ...params },
			})
			.then((response) => {
				dispatch({
					type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
					payload: { hasNextPage: response.data.length !== 0 },
				});
			})
			.catch((error) => {
				if (axios.isCancel(error)) return;
				dispatch({ type: ACTIONS.ERROR, payload: { error: error } });
			});
		return () => {
			cancelToken_1.cancel();
			cancelToken_2.cancel();
		};
	}, [params, page]);

	return state;
}
