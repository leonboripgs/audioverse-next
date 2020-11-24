import { createMachine, StateMachine } from 'xstate';

// TODO: Replace first `any` with interface when context defined
// export interface Context {}
const createFavoriteMachine = (): StateMachine<any, any, any> => {
	return createMachine({
		initial: 'loading',
		context: {},
		states: {
			loading: {
				on: {
					TOGGLE: { target: 'favorited' },
				},
			},
			unfavorited: {
				on: {
					TOGGLE: { target: 'favorited' },
				},
			},
			favorited: {
				on: {
					TOGGLE: { target: 'unfavorited' },
				},
			},
		},
	});
};

export default createFavoriteMachine;
