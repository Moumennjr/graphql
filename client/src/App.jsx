import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import "./App.css";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      age
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      age
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $age: Int!
    $isMarried: Boolean!
  ) {
    createUser(
      name: $name
      age: $age
      isMarried: $isMarried
    ) {
      id
      name
      age
      isMarried
    }
  }
`;

function App() {
  // =========================
  // QUERIES
  // =========================

  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
  } = useQuery(GET_USERS);

  const {
    data: getUserByIdData,
    error: getUserByIdError,
    loading: getUserByIdLoading,
  } = useQuery(GET_USER_BY_ID, {
    variables: {
      id: "1",
    },
  });

  // =========================
  // MUTATION
  // =========================

  const [createUser] = useMutation(CREATE_USER);

  // =========================
  // FORM STATE
  // =========================

  const [newUser, setNewUser] = useState({
    name: "",
    age: null,
    isMarried: null,
  });

  const [createdUser, setCreatedUser] = useState(null);

  // =========================
  // HANDLE INPUT CHANGES
  // =========================

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let newValue = value;

    if (type === "number") {
      newValue = value === "" ? null : Number(value);
    }

    if (type === "radio") {
      newValue = value === "true";
    }

    setNewUser((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // =========================
  // CREATE USER
  // =========================

  const handleCreateUser = async () => {
    console.log("Creating user:", newUser);

    try {
      const result = await createUser({
        variables: {
          name: newUser.name,
          age: Number(newUser.age),
          isMarried: newUser.isMarried,
        },
        refetchQueries: [{ query: GET_USERS }],
      });

      setCreatedUser(result.data.createUser);
      setNewUser({ name: "", age: null, isMarried: null });

      console.log("Created user:", result.data.createUser);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // =========================
  // LOG STATE CHANGES
  // =========================

  useEffect(() => {
    console.log("The new user:", newUser);
  }, [newUser]);

  // =========================
  // UI
  // =========================

  return (
    <div className="app">
      {/* =========================
          ALL USERS
      ========================= */}

      <h1 className="title">Users:</h1>

      {createdUser && (
        <div className="created-user">
          <strong>Just created:</strong>
          <p>Name: {createdUser.name}</p>
          <p>Age: {createdUser.age}</p>
          <p>Civil situation: {createdUser.isMarried ? "Married" : "Single"}</p>
        </div>
      )}

      <div className="users-grid">
        {getUsersLoading ? (
          <p className="message">Data loading...</p>
        ) : getUsersError ? (
          <p className="message error">Error: {getUsersError.message}</p>
        ) : (
          getUsersData?.getUsers.map((user) => (
            <div className="user-card" key={user.id}>
              <span className="user-card__badge">
                {user.id}
              </span>
              <p className="user-card__name">{user.name}</p>

              <p className="user-card__age">Age: {user.age}</p>

              <p className="user-card__status">
                {user.isMarried ? "Married" : "Single"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* =========================
          USER BY ID
      ========================= */}

      <h1 className="title">The chosen user:</h1>

      <div>
        {getUserByIdLoading ? (
          <p className="message">Data loading...</p>
        ) : getUserByIdError ? (
          <p className="message error">Error: {getUserByIdError.message}</p>
        ) : (
          getUserByIdData?.getUserById && (
            <div className="user-card">
              <span className="user-card__badge">
                {getUserByIdData.getUserById.id}
              </span>
              <p className="user-card__name">
                {getUserByIdData.getUserById.name}
              </p>

              <p className="user-card__age">
                Age: {getUserByIdData.getUserById.age}
              </p>

              <p className="user-card__status">
                {getUserByIdData.getUserById.isMarried
                  ? "Married"
                  : "Single"}
              </p>
            </div>
          )
        )}
      </div>

      {/* =========================
          CREATE USER FORM
      ========================= */}

      <h1 className="title">Create a user:</h1>

      <div className="form">
        {/* NAME */}

        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={newUser.name}
          onChange={handleChange}
          className="form__input"
        />

        {/* AGE */}

        <input
          type="number"
          name="age"
          placeholder="Enter your age"
          value={newUser.age ?? ""}
          onChange={handleChange}
          className="form__input"
        />

        {/* MARRIED */}

        <div className="form__radio-group">
          <label htmlFor="married">
            <input
              type="radio"
              name="isMarried"
              id="married"
              value="true"
              checked={newUser.isMarried === true}
              onChange={handleChange}
            />
            Married
          </label>

          {/* SINGLE */}

          <label htmlFor="single">
            <input
              type="radio"
              name="isMarried"
              id="single"
              value="false"
              checked={newUser.isMarried === false}
              onChange={handleChange}
            />
            Single
          </label>
        </div>

        {/* CREATE BUTTON */}

        <button onClick={handleCreateUser} className="form__button">
          Create the user
        </button>
      </div>
    </div>
  );
}

export default App;