import React from "react";
import "./App.css";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

// const isSearched = (searchTerm) => (item) =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

//it coulb be this way:
// item => item.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()
//inside filter()
//but he wanted to show a high order function

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);

    this.onDismiss = this.onDismiss.bind(this);

    this.onSearchChange = this.onSearchChange.bind(this);

    this.onSearchSubmit = this.onSearchSubmit.bind(this);

    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((error) => error);
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    this.fetchSearchTopStories(searchTerm);
  }

  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits },
    });
  }

  onSearchSubmit(e) {
    e.preventDefault();
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const { searchTerm, result } = this.state;

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {result ? (
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}
          />
        ) : null}
      </div>
    );
  }
}

const Button = ({ onClick, className = "", children }) => {
  return (
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>
  );
};

const Search = ({ value, onChange, onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit}>
      <input type="text" onChange={onChange} value={value} />
      <button type="submit">{children}</button>
    </form>
  );
};



const Table = ({ list, onDismiss }) => {
  return (
    <div className="table">
      {list.map((item) => {
        return (
          <div key={item.objectID} className="table-row">
            <span style={{ width: "40%" }}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: "30%" }}>{item.author}</span>
            <span style={{ width: "10%" }}>{item.num_comments}</span>
            <span style={{ width: "10%" }}>{item.points}</span>
            <span style={{ width: "10%" }}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default App;
