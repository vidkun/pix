import React from 'react'
import {Router, IndexRoute, Route, Redirect, browserHistory} from 'react-router'
import {gql, connectGraph} from 'react-graphql'

import App from './app'
import FirstRunController from './controllers/first-run'
import LibrariesController from './controllers/libraries'
import AddLibraryController from './controllers/add-library'
import ViewLibraryController from './controllers/view-library'
import ViewLibraryFolderController from './controllers/view-library/folder'
import LoginController from './controllers/login'
import HomeController from './controllers/home'
import ViewMediaController from './controllers/view-media'
import LibrarySettingsController from './controllers/library-settings'
import AdminController from './controllers/admin'
import AdminUsersController from './controllers/admin/users'
import AdminAddUserController from './controllers/admin/add-user'

export default connectGraph({
  query: () => gql`
    query {
      isFirstRun
      viewer {
        user {
          id
        }
      }
    }
  `,
  ignoreUpdates: true,
})(props => {
  let routes = []

  if (props.isFirstRun) {
    routes = [
      <Route key={0} path="/first-run" component={FirstRunController} />,
      <Redirect key={1} from="*" to="/first-run" />,
    ]
  } else if (props.viewer.user) {
    routes = [
      <Redirect key={0} from="/" to="/libraries" />,
      <Route key={1} path="/view/:mediaId" component={ViewMediaController} />,
      <Route key={2} path="/" component={App}>
        <Redirect from="login" to="libraries" />,
        <Redirect from="first-run" to="libraries" />,
        <Route path="libraries" component={LibrariesController}>
          <IndexRoute component={HomeController} />
          <Route path="add" component={AddLibraryController} />
          <Route path=":libraryId" component={ViewLibraryController} />
          <Route path=":libraryId/settings" component={LibrarySettingsController} />
          <Route path=":libraryId/*" component={ViewLibraryFolderController} />
        </Route>
        <Route path="admin" component={AdminController}>
          <IndexRoute component={AdminUsersController} />
          <Route path="users/add-user" component={AdminAddUserController} />
        </Route>,
      </Route>,
    ]
  } else {
    routes = [
      <Route key={0} path="/login" component={LoginController} />,
      <Redirect key={1} from="*" to="/login" />,
    ]
  }

  return (
    <Router history={browserHistory}>
      {routes}
    </Router>
  )
})
