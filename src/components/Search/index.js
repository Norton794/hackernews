export const Search = ({ value, onChange, onSubmit, children }) => {
    return (
      <form onSubmit={onSubmit}>
        <input type="text" onChange={onChange} value={value} />
        <button type="submit">{children}</button>
      </form>
    );
  };