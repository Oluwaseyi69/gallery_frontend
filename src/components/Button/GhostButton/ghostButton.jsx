export function GhostButton({ text, color, padding, borderRadius, callBack }) {
  return (
    <button
      className={`py-3 px-6 bg-none text-white border-none rounded-full font-bold`}
      style={{ borderRadius: borderRadius, cursor: "pointer" }}
      onClick={() => callBack()}
    >
      {text}
    </button>
  );
}

export default GhostButton