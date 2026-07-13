import Item from "../../WashObject/wash";
import classes from "./list.module.css";

export default function WashesList({ objects }) {
  console.log(objects);

  return (
    <div className={classes.listContainer}>
      {objects.map((object) => (
        <Item key={object.ID} item={object} />
      ))}
    </div>
    
  );
}
