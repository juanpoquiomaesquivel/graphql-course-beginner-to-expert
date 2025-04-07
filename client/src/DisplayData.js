import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";
import React from "react";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      age
      username
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      name
    }
  }
`;

const QUERY_GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const MUTATION_CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
    }
  }
`;

function DisplayData(props) {
  const [movieSearched, setMovieSearched] = React.useState("");
  // for user creation
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [age, setAge] = React.useState(0);
  const [nationality, setNationality] = React.useState("");

  const { data, loading, error, refetch } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(QUERY_GET_MOVIE_BY_NAME);
  const [createUser] = useMutation(MUTATION_CREATE_USER);

  if (loading) {
    return <p>Loading...</p>;
  }

  /* if (data) {
    console.log(data);
  }

  if (error) {
    console.log(error);
  }

  if (movieSearchedData) {
    console.log(movieSearchedData);
  }

  if (movieError) {
    console.log(movieError);
  } */

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Name..."
          onChange={(evt) => setName(evt.target.value)}
        />
        <input
          type="text"
          placeholder="Username..."
          onChange={(evt) => setUsername(evt.target.value)}
        />
        <input
          type="number"
          placeholder="Age..."
          onChange={(evt) => setAge(Number(evt.target.value))}
        />
        <input
          type="text"
          placeholder="Nationality..."
          onChange={(evt) => setNationality(evt.target.value.toUpperCase())}
        />
        <button
          onClick={() => {
            createUser({
              variables: { input: { name, username, age, nationality } },
            });

            refetch();
          }}
        >
          Create user
        </button>
      </div>
      {data &&
        data.users.map((user) => (
          <p>
            <h1>Name: {user.name}</h1>
            <h1>Username: {user.username}</h1>
            <h1>Age: {user.age}</h1>
            <h1>Nationality: {user.nationality}</h1>
          </p>
        ))}
      {movieData &&
        movieData.movies.map((movie) => (
          <p>
            <h1>Movie: {movie.name}</h1>
          </p>
        ))}
      {
        <div>
          <input
            type="text"
            placeholder="Interstellar..."
            onChange={(evt) => setMovieSearched(evt.target.value)}
          />
          <button
            onClick={() => {
              fetchMovie({
                variables: {
                  name: movieSearched,
                },
              });
            }}
          >
            Fetch Data
          </button>
          <div>
            {movieSearchedData && (
              <div>
                <h1>Name: {movieSearchedData.movie.name}</h1>
                <h1>
                  Year of Publication:{" "}
                  {movieSearchedData.movie.yearOfPublication}
                </h1>
              </div>
            )}
            {movieError && (
              <div>
                <h1>There was an error fetching the data...</h1>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
}

export default DisplayData;
