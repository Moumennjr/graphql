import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import './App.css'


const GET_USERS = gql`
  query getUsers {
    getUsers {
      id
      name
      age
      isMarried
    
    }
  }

`;

function App() {
  
  const {data, error, loading} = useQuery(GET_USERS)

  if (loading) return <p>Data loading ...</p>
  if (error) return <p>Error: {error.message} </p>
  return (
    <>
        <h1>Users: </h1>
        <div>
          {
            data.getUsers.map((user)=> (
              <div key={user.id} >
                <p>Name: {user.name}</p>
                <p>Age: {user.age} </p>
                <p>Civil situation: {user.isMarried ? "Married" : "Single"} </p>
              </div>
            ))
          }
        </div>
    </>
  )
}

export default App
