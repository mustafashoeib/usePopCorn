import { useEffect, useState } from "react";


export function useMovies(query,KEY) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setIsLoading(true);
          setError("");
          let res;
          /// clean up fetch requests
          const controller = new AbortController();
          try {
            res = await fetch(
              `https://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
              { signal: controller.signal }
            );
          } catch (err) {
            if (!res || !res.ok) {
              throw new Error("Something went wrong during fetching");
            }
          }
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie is not found");
          setMovies(data.Search);
          // console.log(data.Search);
          setError("");
        } catch (err) {
          // console.log(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovie();
      // handleCloseMovie();
    },
    [query,KEY]
  );
  return { movies, isLoading, error };
}
