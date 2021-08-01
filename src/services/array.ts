import * as A from 'fp-ts/es6/Array';
import { flow, pipe } from 'fp-ts/es6/function';
import * as O from 'fp-ts/es6/Option';

const array: Array<number> = [1, 2, 3];

const i = 100;

// typescript thinks this is fine, but this will fail at runtime
// we want to avoid runtime errors at all costs
const itemThatIsNotThere = array[i];

// why it is not there does not matter, so no need for returning errors
// but if it not there, it needs to indicate that
// if we handle the option properly, this version will never fail
const itemThatIsOptional = A.lookup(i)(array);

// inserting can also fail if there is no such index, althugh technically
// it can just insert at the end, but that might be undesirable
const insertOneAsTheHundreadthElement = A.insertAt(1, 99);
const result = insertOneAsTheHundreadthElement(array);

// working with optionals
if (O.isSome(itemThatIsOptional)) {
  console.log(itemThatIsOptional.value);
} else {
  console.error('Item was not found');
}

// a better way
console.log(
  O.fold(
    () => 'Item was not found',
    (value: number) => value.toString(),
  )(itemThatIsOptional),
);

// an even better way, where type inference works
const displayError = () => 'Item was not found';
console.log(
  pipe(
    itemThatIsOptional,
    O.fold(displayError, (value) => value.toString()),
  ),
);

// extracting the "fold" we can create reusable folds
const numberToString = (v: number) => v.toString();
const foldItem = O.fold(displayError, numberToString);
console.log(foldItem(itemThatIsOptional));

// working with containers like Optional
// we shall try to work with the container as long as possible and only fold
// at the very end if needed
const multiplyBy5 = (v: number) => v * 5;
console.log(pipe(itemThatIsOptional, O.map(multiplyBy5), foldItem));

// filter/map
const predicate = (v: number) => v > 10;
const filterAndMap = (array2: Array<number>): Array<string> =>
  pipe(array2, A.filter(predicate), A.map(multiplyBy5), A.map(numberToString));

// even sorter
const filterAndMap2 = flow(
  A.filter(predicate),
  A.map(multiplyBy5),
  A.map(numberToString),
);
