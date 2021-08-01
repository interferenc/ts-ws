import { Lens } from 'monocle-ts';
import { pipe } from 'fp-ts/es6/function';
import { BrandedPerson, Person, personId } from './person';
import { BrandedLocation, Location, locationId } from './location';

export interface Poll {
  id: number;
  title: string;
  author: Person;
}

// members are enforced
const john: Person = {
  id: 1,
  name: 'John',
  address: 'Mitte, Berlin',
  avatar: new URL('https://some.url/john.jpeg'),
};

// members can be missing
const johnCasted = {
  id: 1,
  name: 'John',
  address: 'Berlin',
  avatar: new URL('https://some.url/john.jpg'),
} as Person;

// members can have types
const poll = {
  id: 2,
  title: 'What do you like to eat for breakfast?',
  authora: john,
};

// all is enforced
const pollWithType: Poll = {
  id: 2,
  title: 'What do you like to eat for breakfast?',
  author: john,
};

const location: Location = {
  id: 5,
  name: 'Office',
  address: 'Kreuzberg, Berlin',
  avatar: new URL('https://some.url/office.jpeg'),
};

const pollWithMistake: Poll = {
  id: 3,
  title: 'When do you get up usually?',
  author: location,
};

console.log(pollWithMistake);

export interface PollWithBrandedAuthor {
  id: number;
  title: string;
  author: BrandedPerson;
}

const brandedJohn: BrandedPerson = {
  id: personId(5),
  name: 'John',
  address: 'Mitte, Berlin',
  avatar: new URL('https://some.url/john.jpeg'),
};

const brandedOffice: BrandedLocation = {
  id: locationId(6),
  name: 'John',
  address: 'Mitte, Berlin',
  avatar: new URL('https://some.url/john.jpeg'),
};

export interface BrandedPoll {
  id: number;
  title: string;
  author: BrandedPerson;
}

const brandedBollWithMistake2: BrandedPoll = {
  id: 6,
  title: 'something',
  author: brandedOffice,
};

const brandedPoll: BrandedPoll = {
  id: 6,
  title: 'something',
  author: brandedJohn,
};

// optics
// setting nested object keys is very verbose when done immutable
const newBrandedPoll: BrandedPoll = {
  ...brandedPoll,
  author: {
    ...brandedPoll.author,
    name: 'some other name',
  },
};

const pollLens = Lens.fromPath<BrandedPoll>();
export const authorName = pollLens(['author', 'name']);

const authorName1 = authorName.get(brandedPoll);
const newBrandedPoll2 = authorName.set('some other name')(brandedPoll);
const newBrandedPoll3 = pipe(brandedPoll, authorName.set('some other name'));

const appendToAuthorName = authorName.modify((v) => `${v} something appended`);
