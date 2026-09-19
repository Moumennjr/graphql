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

const GET_USER_BY_ID = gql`
  query getUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      age
      isMarried
    
    }
  }

`;
function App() {
  
  const {data: getUsersData, error: getUsersError, loading: getUsersLoading} = useQuery(GET_USERS)
  const {data: getUserByIdData, error: getUserByIdError, loading: getUserByIdLoading} = useQuery(GET_USER_BY_ID,{
    variables: {id: "1"}
  })

  
  return (
    <>
        <h1>Users: </h1>
        <div>
          {
            getUsersLoading ? <p>Data loading ...</p> :
            getUsersError ? <p>Error: {error.message} </p> :
            getUsersData.getUsers.map((user)=> (
              <div key={user.id} >
                <p>Name: {user.name}</p>
                <p>Age: {user.age} </p>
                <p>Civil situation: {user.isMarried ? "Married" : "Single"} </p>
              </div>
            ))
          }
        </div>


        <h1>The chosen user:  </h1>
        <div>
          {
            getUserByIdLoading ? <p>Data loading ...</p> :
            getUserByIdError ? <p>Error: {error.message} </p> :
                getUserByIdData.getUserById &&
                  <div  >
                <p>Name: {getUserByIdData.getUserById.name}</p>
                <p>Age: {getUserByIdData.getUserById.age} </p>
                <p>Civil situation: {getUserByIdData.getUserById.isMarried ? "Married" : "Single"} </p>
              </div>
          
          }
        </div>
    </>
  )
}

export default App
