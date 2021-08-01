export interface Location {
  id: number;
  name: string;
  address: string;
  avatar: URL;
}

interface LocationID {
  _tag: 'location-id';
  value: number;
}

export const locationId = (value: number): LocationID => ({
  _tag: 'location-id',
  value,
});

export interface BrandedLocation {
  id: LocationID;
  name: string;
  address: string;
  avatar: URL;
}
