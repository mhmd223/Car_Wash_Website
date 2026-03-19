export default function Button({ text, type, onClick, style }) {
  return (
    <button onClick={onClick} className="btn" style={style} type={type}>
      {text}
    </button>
  );
}
