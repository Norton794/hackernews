import React from "react";
import axios from "axios";
import PropTypes from 'prop-types';
import './index.css';

import {
   DEFAULT_QUERY,
 DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
   PARAM_SEARCH,
   PARAM_PAGE,
   PARAM_HPP,
   updateSearchTopStoriesState,
   } from '../../constants/index';
  
import {Button, ButtonWithLoading} from '../Button/index'

import Table, {TableWithError} from '../Table/index'


import {Search} from '../Search/index'

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
      // sortKey: 'NONE',
      // isSortReverse: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);

    this.setSearchTopStories = this.setSearchTopStories.bind(this);

    this.onDismiss = this.onDismiss.bind(this);

    this.onSearchChange = this.onSearchChange.bind(this);

    this.onSearchSubmit = this.onSearchSubmit.bind(this);

    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);

    // this.onSort = this.onSort.bind(this);
  }

  // onSort(sortKey) {
  //   const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
  //   this.setState({ sortKey, isSortReverse });
  // }


  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }





  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
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
