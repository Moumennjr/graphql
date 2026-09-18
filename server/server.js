import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"


const users = [
    { id: "1", name: "Nedjar Abdelmoumen", age: 22, isMarried: false },
    { id: "2", name: "Sara Benali", age: 25, isMarried: true },
    { id: "3", name: "Karim Haddad", age: 30, isMarried: true },
    { id: "4", name: "Lina Cherif", age: 19, isMarried: false },
    { id: "5", name: "Yacine Bouzid", age: 28, isMarried: false },
    { id: "6", name: "Amel Meziane", age: 24, isMarried: true }
]

const typeDefs = `
    type Query {
        getUsers: [User]
        getUserById(id: ID!): User
    }

    type Mutation {
        createUser(name: String!, age: Int!, isMarried: Boolean!): User
    }

    type User {
        id: ID
        name: String
        age: Int 
        isMarried: Boolean
    } 
`


const resolvers = {
    Query: {
        getUsers: () => {
            return users
        },
        getUserById: (parent, args) => {
            const id = args.id

            return users.find((user)=> user.id === id)
        }
    },
    Mutation:{
        createUser: (parent, args)=>{

            const { name, age, isMarried } = args

            const newUser = {
                id: ( users.length + 1 ).toString,
                name,
                age,
                isMarried
            }

            users.push(newUser)
            return newUser
        }
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000
    }
})

console.log(`Server running at: ${url}`)