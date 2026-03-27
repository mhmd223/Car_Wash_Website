import classes from "./header.module.css"
export default function Header({username}){
  return <header><h1>Welcome {username}!</h1></header>
}