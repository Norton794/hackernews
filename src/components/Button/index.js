import {Loading} from '../Loading/index'


export const Button = ({ onClick, className = "", children }) => {
    return (
      <button onClick={onClick} className={className} type="button">
        {children}
  
      </button>
    );
  };


  export const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loading />
    : <Component {...rest} />

    export const ButtonWithLoading = withLoading(Button);