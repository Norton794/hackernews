import React from "react";

const list = [
  {
    title: "React",
    url: "https://facebook.github.io/react/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://github.com/reactjs/redux",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const isSearched = (searchTerm) => (item) =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

//it coulb be this way:
// item => item.title.toLowerCase().includes(this.state.searchTerm.toLowerCase()
//inside filter()
//but he wanted to show a high order function

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      list,
      searchTerm: "",
    };

    this.onDismiss = this.onDismiss.bind(this);

    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    const updatedList = this.state.list.filter((item) => item.objectID !== id);
    console.log(updatedList);
    this.setState({ list: updatedList });
  }

  onSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const { searchTerm, list } = this.state;
    return (
      <div className="App">
        <Search value={searchTerm} onChange={this.onSearchChange}>
          Search
        </Search>
        <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}



const Button = ({ onClick, className = '', children }) => {
    return (
      <button onClick={onClick} className={className} type="button">
        {children}
      </button>
    );
}



const Search = ({value, onChange, children}) => {
  return (
    <form>
      {children} <input type="text" onChange={onChange} value={value} />
    </form>
  );
}

const Table = ({ list, pattern, onDismiss }) => {
    return (
      <div>
        {list.filter(isSearched(pattern)).map((item) => {
          return (
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <Button onClick={() => onDismiss(item.objectID)}>
                  Dismiss
                </Button>
              </span>
            </div>
          );
        })}
      </div>
    );
}


export default App;