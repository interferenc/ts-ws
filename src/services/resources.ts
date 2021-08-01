import { BrandedPerson, PersonID, personId } from '@/entities/person';
import * as E from 'fp-ts/es6/Either';
import { flow, pipe } from 'fp-ts/es6/function';
import * as TE from 'fp-ts/lib/TaskEither';

// this will throw if the incoming string is not a proper json
export const parseJson = (payload: string): unknown => JSON.parse(payload);

// a better way
export const betterParseJson = (payload: string): E.Either<Error, unknown> => {
  try {
    return E.right(JSON.parse(payload));
  } catch (error) {
    return E.left(new Error('JSON syntax error'));
  }
};

// even better
export const evenBetterParseJson = (
  payload: string,
): E.Either<Error, unknown> =>
  E.tryCatch(
    () => JSON.parse(payload),
    (error) => new Error('JSON syntax error'),
  );

interface RawPersonData {
  id: number;
  name: string;
  address: string;
  avatar: string;
}

// another one, this time we're decoding the data
// this is the step that can be replaced with io-ts codecs
export const decode = (data: unknown): E.Either<Error, RawPersonData> => {
  if (typeof data !== 'object')
    return E.left(new Error('data is not an object'));
  if (data === null) return E.left(new Error('data is null'));
  if (!('id' in data)) return E.left(new Error('id is missing'));
  if (!('name' in data)) return E.left(new Error('name is missing'));
  // ... shoud check many more

  return E.right({
    id: 5, // should use real data
    name: 'John',
    address: 'Mitte, Berlin',
    avatar: 'https://some.dev/john.jpeg',
  });
};

// let's chain them
const parseAndDecode = (value: string) =>
  pipe(value, evenBetterParseJson, E.chain(decode));

// let's create a transformation function from raw data to what we need
export const transform = (person: RawPersonData): BrandedPerson => ({
  ...person,
  id: personId(person.id),
  avatar: new URL(person.avatar),
});

const parseDecodeTransform = (value: string) =>
  pipe(value, evenBetterParseJson, E.chain(decode), E.map(transform));

// even better, no variable to name!
// every single step can fail, it will stop at the first failure
// every step is a simple function, can be unit tested if needed
const parseDecodeTransformPerson = flow(
  evenBetterParseJson,
  E.map(decode),
  E.flatten,
  // map + flatten: E.chain(decode),
  E.map(transform),
);

// async operations

const fetchPerson = (id: PersonID): TE.TaskEither<Error, Response> =>
  TE.tryCatch(
    () => fetch(`https://some.api/persons/${id.value}`),
    () => new Error('Network error'),
  );

// most api communication
// validate form
// transform to api
// encode
// stringify
// construct request with string payload
// send request, wait for response
// check for network error
// check for server error (response.ok)
// try to parse json (can fail)
// try to decode (can fail)
// transform to entity (can not fail)
// display in ui
