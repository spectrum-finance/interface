export const subjectToId = (subject: string): string => {
  return `${subject.slice(0, 56)}.${subject.slice(56)}`;
};

export const isSubject = (subject: string): boolean =>
  subject.indexOf('.') === -1;
