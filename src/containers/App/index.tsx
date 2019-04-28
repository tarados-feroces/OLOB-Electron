import * as React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import * as PathConstants from '../../constants/PathsConstants';
import LoginContainer from '../LoginContainer';
import SignupContainer from '../SignupContainer';
import AuthorizedContainer from '../AuthorizedContainer';
import PopupWrapper from '../PopupContainer';

import 'semantic-ui-css/semantic.min.css';
import { getUser } from '../../redux/actions/User';

const history = createMemoryHistory();

interface AppProps {
    getUser?(): void;
}

class App extends React.Component<AppProps> {
    public componentDidMount() {
        this.props.getUser();
    }

    public render() {
        return (
            <>
                <Router history={history}>
                    <Switch>
                        <Route exact={true} path={PathConstants.MAINPAGE} component={LoginContainer} />
                        <Route exact={true} path={PathConstants.LOGIN} component={LoginContainer} />
                        <Route exact={true} path={PathConstants.SIGNUP} component={SignupContainer} />
                        <Route exact={true} path={PathConstants.AUTH} component={AuthorizedContainer} />
                    </Switch>
                </Router>
                <PopupWrapper />
            </>
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
