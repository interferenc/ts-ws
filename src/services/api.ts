import { BrandedPerson, PersonID } from '@/entities/person';

type Initial = { pending: false };
type Pending = { pending: true };
type Success<T> = { pending: false; result: T };
type Err = { pending: false; error: Error };

export type State<T> = Initial | Pending | Success<T> | Err;

export const isSuccess = <T>(state: State<T>): state is Success<T> =>
  !state.pending && 'result' in state;
export const isError = <T>(state: State<T>): state is Err =>
  !state.pending && 'error' in state;

export const fetchPerson = (id: PersonID): BrandedPerson => {
  // type inference is great, but we have to specific in many cases
  let state: State<BrandedPerson> = { pending: false };

  // we need to fight typescript a bit on this one
  state = { pending: true } as State<BrandedPerson>;

  // do something that errors out
  const error = new Error('something bad happened');

  // only atomic changes, only allowed states
  state = { pending: true, error };

  const result: BrandedPerson = {
    id,
    name: 'John',
    address: 'Mitte, Berlin',
    avatar: new URL('https://some.dev/john.jpeg'),
  };

  return result;
};

const errorState: State<BrandedPerson> = {
  pending: false,
  error: new Error('oops'),
};

const logState = (state: State<BrandedPerson>): void => {
  if (isSuccess(state)) {
    console.log(JSON.stringify(state.result)); // state.result is safe to access because of type guard
  } else if (isError(state)) {
    console.log(`Error: ${state.error.message}`);
  } else if (state.pending) {
    console.log('Pending');
  } else {
    console.log('Initial');
  }
};
