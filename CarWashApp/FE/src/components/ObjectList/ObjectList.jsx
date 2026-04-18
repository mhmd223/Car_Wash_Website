import Item from "../Item/Item";
import classes from "./list.module.css";

export default function ObjectList({ objects }) {
  console.log(objects);

  return (
    <div className={classes.listContainer}>
      {objects.map((object) => (
        <Item key={object.ID} item={object} />
      ))}
    </div>
  );
}
