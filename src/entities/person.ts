export interface Person {
  id: number;
  name: string;
  address: string;
  avatar: URL;
}

export interface PersonID {
  _tag: 'person-id';
  value: number;
}

export const personId = (value: number): PersonID => ({
  _tag: 'person-id',
  value,
});

export interface BrandedPerson {
  id: PersonID;
  name: string;
  address: string;
  avatar: URL;
}
