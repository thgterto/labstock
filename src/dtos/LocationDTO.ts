export interface Location {
  id: string;
  name: string;
  code: string;
  type: 'room' | 'cabinet' | 'shelf' | 'freezer';
}
