const { UserList, MovieList } = require("../FakeData");
const lodash = require("lodash");

/*
query -> users -> favoriteMovies


query ExampleQuery {
  users {
    ...GetAgeAndName
  }
}

fragment GetAgeAndName on User {
  name
  age
  nationality
}

-- reusable code
*/

const resolvers = {
  Query: {
    // User resolvers
    users: (parent, args, context, info) => {
      if (UserList) return { users: UserList };

      return { message: "Yo, there was an error" };
    },
    user: (_, args) => {
      return lodash.find(UserList, { id: Number(args.id) });
    },

    // Movie resolvers
    movies: () => {
      return MovieList;
    },
    movie: (_, args) => {
      return lodash.find(MovieList, { name: args.name });
    },
  },
  User: {
    favoriteMovies: () => {
      return lodash.filter(
        MovieList,
        (movie) =>
          movie.yearOfPublication >= 2000 && movie.yearOfPublication <= 2010
      );
    },
  },
  Mutation: {
    createUser: (_, args) => {
      const user = args.input;
      const lastId = UserList[UserList.length - 1].id;
      user.id = lastId + 1;
      UserList.push(user);
      return user;
    },

    updateUsername: (_, args) => {
      const { id, newUsername } = args.input;
      const user = lodash.find(UserList, { id: Number(id) });

      if (user !== null) {
        user.username = newUsername;
      }

      return user;
    },

    deleteUser: (_, args) => {
      const id = args.id;
      lodash.remove(UserList, (user) => user.id === Number(id));
      return null;
    },
  },

  UsersResult: {
    __resolveType: (obj, context, info) => {
      if (obj.users) {
        return "UsersSuccessfulResult";
      }

      if (obj.message) {
        return "UsersErrorResult";
      }

      return null;
    },
  },
};

module.exports = { resolvers };
