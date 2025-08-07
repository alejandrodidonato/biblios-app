// components/BookList.jsx
import useApi from '../hooks/useApi';
import BookGrid from './BookGrid';

const extractCover = (item) => {
  const isbnObj =
    item.volumeInfo.industryIdentifiers?.find(i => i.type === 'ISBN_13') ||
    item.volumeInfo.industryIdentifiers?.find(i => i.type === 'ISBN_10');
  const isbn = isbnObj ? isbnObj.identifier : null;
  const thumbnail = item.volumeInfo.imageLinks?.thumbnail;
  const openLibraryCover = isbn
    ? `https://covers.openlibrary.org/b/isbn/${isbn}.jpg`
    : null;
  return thumbnail || openLibraryCover || null;
};

export default function BookList() {
  const { bookData } = useApi();

  return (
    <BookGrid
      books={Array.from(bookData)}
      getLink={item => `../book/${item.id}`}
      getState={item => ({
        book: item,
        coverUrl: extractCover(item) || '/img/default-book.png',
      })}
      getCover={item => extractCover(item)}
      getAlt={item => item.volumeInfo.title}
      noResultsMessage="No se encontraron libros para esa búsqueda."
    />
  );
}
