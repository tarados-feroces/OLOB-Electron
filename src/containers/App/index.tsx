import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import { bindActionCreators } from 'redux';
import * as PathConstants from '../../constants/PathsConstants';
// import MainPage from '../MainPage';
import LoginContainer from '../LoginContainer';
import SignupContainer from '../SignupContainer';
import AuthorizedContainer from '../AuthorizedContainer';

import 'semantic-ui-css/semantic.min.css';
import { getUser } from '../../redux/actions/User';

const history = createBrowserHistory();

interface AppProps {
    getUser?(): void;
}

class App extends React.Component<AppProps> {
    public componentDidMount() {
        this.props.getUser();
    }

    public render(): JSX.Element {
        return (
            <Router history={history}>
                <Switch>
                    {/*<Route exact={true} path={PathConstants.MAINPAGE} component={MainPage} />*/}
                    <Route exact={true} path={PathConstants.LOGIN} component={LoginContainer} />
                    <Route exact={true} path={PathConstants.SIGNUP} component={SignupContainer} />
                    <Route exact={true} path={PathConstants.AUTH} component={AuthorizedContainer} />
                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        getUser() {
            dispatch(getUser());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
