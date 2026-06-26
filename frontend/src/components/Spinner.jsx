const Spinner = ({ dark }) => (
  <div className={`w-5 h-5 border-[3px] rounded-full animate-spin ${
    dark
      ? "border-slate-800 border-t-transparent"
      : "border-white border-t-transparent"
  }`} />
);

export default Spinner;