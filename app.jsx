import { render, h, Fragment } from "preact";
import { useState, useEffect } from "preact/hooks";
import "preact/devtools";
const App = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        setData(json);
      });
  }, []);

  const search = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery
        .split(" ")
        .join("_")}`
    )
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        setData(json);
      });
  };

  return (
    <div class="bg-zinc-900 flex flex-col gap-6 p-6 min-h-screen text-white">
      <form class="flex max-h-10 gap-6 max-w-xs">
        <input
          class="bg-zinc-800 focus:bg-zinc-700 p-2 placeholder:text-zinc-400 rounded-lg grow focus:outline-1 focus:outline-zinc-200"
          type="text"
          onInput={(e) => {
            setSearchQuery(e.target.value);
          }}
          value={searchQuery}
          placeholder="Search for a recipe..."
        />
        <button
          class="aspect-square p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 max-h-10"
          onClick={search}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            class="w-6 h-6 text-zinc-400"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
      {!loading && (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.meals.map((el) => {
            return (
              <div class="flex flex-col sm:rounded-lg p-4 bg-zinc-800">
                <img
                  class="rounded-lg max-w-full object-contain"
                  src={el.strMealThumb}
                />

                <h1 class="text-3xl font-black text-center">{el.strMeal}</h1>
                <h2 class="text-xl text-center">{el.strArea}</h2>
                <ul class="ml-6 mb-4 list-disc">
                  {Object.keys(el).map((x) => {
                    if (x.startsWith('strIngredient') && el[x] != '' && el[x] != null) {
                      let measure = `strMeasure${x.split('t')[2]}`;
                      return <li>{el[measure]} {el[x]}</li>;
                    }
                  })}
                </ul>
                <p class="text-center whitespace-pre-line">{el.strInstructions}</p>
              </div>
            );
          })}
        </div>
      )}
      {loading && <h1 class="text-3xl">Loading...</h1>}
    </div>
  );
};

render(<App />, document.body);
