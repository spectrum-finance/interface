export interface Searchable {
  match: (term: string) => boolean;
}
