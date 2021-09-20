import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import PropTypes from 'prop-types';

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

// const isSearched = (searchTerm) => (item) =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

//it coulb be this way:
// item => item.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()
//inside filter()
//but he wanted to show a high order function

class App extends React.Component {
  _isMounted = false;
  constructor() {
    super();

    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);

    this.setSearchTopStories = this.setSearchTopStories.bind(this);

    this.onDismiss = this.onDismiss.bind(this);

    this.onSearchChange = this.onSearchChange.bind(this);

    this.onSearchSubmit = this.onSearchSubmit.bind(this);

    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
      isLoading: false
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(
        (result) => this._isMounted && this.setSearchTopStories(result.data)
      )
      .catch((error) => {
        
          this.setState({ isLoading: false });
          this._isMounted && this.setState({ error });
        
      });
  }

  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
    });
  }

  onSearchSubmit(e) {
    e.preventDefault();
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
  }

  onSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;

    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

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

        {list ? (<TableWithError error={error} list={list} onDismiss={this.onDismiss} />) : null}

        {/* {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : list ? (
          <Table list={list} onDismiss={this.onDismiss} />
        ) : null} */}

        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading} onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>


        </div>
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


const Loading = () =>
  <div className="center">
    <div className="ball-one">
      <div className="ball-two">
        <div className="ball-three"></div>
      </div>
    </div>
  </div>


const HasError = () =>
  <div className="interactions">
    <p>Something went wrong.</p>
  </div>


//HOC

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loading />
    : <Component {...rest} />


const withError = (Component) => ({ error, ...rest }) =>
  error
    ? <HasError />
    : <Component {...rest} />

const TableWithError = withError(Table);

const ButtonWithLoading = withLoading(Button);

//propTypes

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.string
};

Search.defaultProps = {
  children: 'Submit',
};

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};




export default App;

export {
  Button,
  Search,
  Table,
};
