export default function Button({ classN, text, type, onClick }) {
  return (
    <button className={classN} onClick={onClick}type={type}>
      {text}
    </button>
  );
}
